import path from 'path';
import _ from 'underscore';
import fs from 'fs-jetpack';
import response from '../../lib/response.es6';
import { getPrefix } from '../../lib/utilities.es6';
import shell from 'shelljs';

function exec(command, options = {}) {
  options.async = true;

  return shell.exec(command, options);
}

module.exports = {
  /**
   * 初始化博客.
   *
   * @return {Object}
   */
  '$blog.init': function (done) {
    try {
      shell.cd(getPrefix() + '/blog');

      let child = exec('hexo init blog');

      child.on('close', function () {
        return done(response(200, '初始化成功'));
      });
    } catch (e) {
      fs.write('/Users/artisan/Desktop/hexo.log', 'error:'+ e);
    }
  },

  /**
   * 发布.
   *
   * @return {Object}
   */
  '$blog.deploy': function (done) {
    shell.cd(path.join(getPrefix(), 'blog'));

    // 编译文章.
    let generator = exec('hexo generate');

    generator.on('close', function () {
      // 发布文章.
      let deployer = exec('hexo deploy');

      deployer.stderr.on('data', function () {
        return done(response(500, '发布失败'));
      });

      deployer.on('close', function () {
        return (done(response('发布成功')));
      });
    });

    generator.stderr.on('data', function () {
      return done(response(500, '编译失败'));
    });
  }
};
