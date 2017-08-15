import path from 'path';
import _ from 'underscore';
import fs from 'fs-jetpack';
import shell from 'shelljs';
import response from '../../lib/response.es6';
import { getPrefix } from '../../lib/utilities.es6';
import logger from '../../lib/logger.es6';

function exec(command, options = {}) {
  options.async = true;

  return shell.exec(command, options);
}

var checkEnvironment = function () {
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
    if ( ! checkEnvironment() ) {
      logger.error('博客初始化失败：环境欠缺');
      return done(response(500, '初始化失败'));
    }

    try {
      let prefix = getPrefix().replace(/\/$/, ''),
          index = prefix.lastIndexOf('/'); // 获取不带目录名称的前缀

      if ( fs.exists(prefix) === 'dir' ) {
        return done(response(500, '文件夹已存在'));
      }

      shell.cd(prefix.substr(0, index));

      let child = exec(`hexo init ${ prefix.substr(index + 1) }`);

      child.on('close', function () {
        return done(response(200, '初始化成功，快去撰写博文吧~'));
      });

      child.stderr.on('data', function (reason) {
        logger.warn(`博客初始化异常：${ reason }`);

        if (/^WARN/.test(reason)) {
          let message = '初始化失败';

          if (/npm\sinstall/.test(reason)) {
            message = '博客依赖包安装失败';
          }

          return done(response(500, message));
        }
      });
    } catch (reason) {
      logger.error(`博客初始化失败：${ reason }`);
      return done(response(500, '初始化失败'));
    }
  },

  /**
   * 发布.
   *
   * @return {Object}
   */
  '$blog.deploy': function (done) {
    if ( ! checkEnvironment() ) {
      logger.error('博客发布失败：环境欠缺...');
      return done(response(500, '初始化失败'));
    }

    shell.cd(path.join(getPrefix()));

    // 编译并发布文章.
    let generator = exec('hexo generate -d');

    generator.on('close', function () {
      return done(response('发布成功'));
    });

    generator.stderr.on('data', function (reason) {
      if (reason === 'Everything up-to-date') {
        return done(response('发布成功'));
      }

      logger.error(`博客发布异常：${ reason }`);
    });
  }
};
