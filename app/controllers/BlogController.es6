import path from 'path';
import _ from 'underscore';
import fs from 'fs-jetpack';
import shell from 'shelljs';
import response from '../../lib/response.es6';
import { getPrefix } from '../../lib/utilities.es6';

function exec(command, options = {}) {
  options.async = true;

  return shell.exec(command, options);
}

var checkNodeEnv = function () {
  let node = shell.which('node');

  if ( typeof node.stdout === 'string' ) {
    shell.config.execPath = node.stdout;
  }

  return shell.which('hexo').code === 0;
}

module.exports = {
  /**
   * 初始化博客.
   *
   * @return {Object}
   */
  '$blog.init': function (done) {
    if ( ! checkNodeEnv() ) {
      return done(response(500, '初始化失败'));
    }

    try {
      let prefix = getPrefix().replace(/\/$/, ''),
          index = prefix.lastIndexOf('/'); // 获取不带目录名称的前缀

      shell.cd(prefix.substr(0, index));

      let child = exec(`hexo init ${ prefix.substr(index + 1) }`);

      child.on('close', function () {
        return done(response(200, '初始化成功'));
      });
    } catch (e) {
      return done(response(500, '初始化失败'));
    }
  },

  /**
   * 发布.
   *
   * @return {Object}
   */
  '$blog.deploy': function (done) {
    if ( ! checkNodeEnv() ) return;

    shell.cd(path.join(getPrefix(), 'blog'));

    // 编译文章.
    let generator = exec('hexo generate');

    generator.on('close', function () {
      // 发布文章.
      let deployer = exec('hexo deploy');

      deployer.on('close', function () {
        return (done(response('发布成功')));
      });

      deployer.stderr.on('data', function () {
        return done(response(500, '发布失败'));
      });
    });

    generator.stderr.on('data', function (e) {
      return done(response(500, '编译失败'));
    });
  }
};
