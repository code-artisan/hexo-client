import path from 'path';
import _ from 'underscore';
import fs from 'fs-jetpack';
import response from '../../lib/response.es6';
import { getPrefix } from '../../lib/utilities.es6';
import shell from 'shelljs';
import winston from 'winston';

const isDevelop = process.env.NODE_ENV === 'development';

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
    let dir = path.join(getPrefix(), 'blog');

    try {
      let child = exec(`hexo init ${ dir }`);

      child
        .stderr
        .on('data' , function () {
          return done(response(500, '博客初始化失败'));
        });

      child
        .on('close', function () {
          return done(response());
        });
    } catch (e) {

    }
  },

  /**
   * 本地预览.
   *
   * @return {Object}
   */
  '$blog.start': function (done) {
    let dir = path.join(getPrefix(), 'blog');

    try {
      shell.cd(dir);

      let child = exec('hexo server');

      child
        .stderr
        .on('data' , function () {
          return done(response(500, '博客预览失败'));
        });

      child
        .stdout
        .on('data' , function () {
          return done(response());
        });
    } catch (e) {
      return done(reverse(500));
    }
  },

  /**
   * 发布.
   *
   * @return {Object}
   */
  '$blog.deploy': function (done) {
    let dir = path.join(getPrefix(), 'blog');

    try {
      if ( ! shell.which('git') ) {
        return done(response(500, '请先安装 git'));
      }

      shell.cd(dir);

      let child = exec('hexo generate && hexo deploy');

      child
        .stderr
        .on('data' , function () {
          return done(response(500, '博客发布失败'));
        });

      child
        .on('close', function () {
          return done(response());
        });
    } catch (e) {
      return done(reverse(500));
    }
  }
};
