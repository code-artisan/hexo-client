import fs from 'fs-jetpack';
import path from 'path';
import glob from 'glob';
import _ from 'underscore';
import response from '../../lib/response.es6';
import { getPrefix } from '../../lib/utilities.es6';
import { json, markdown } from '../../lib/hexo.es6';
import logger from '../../lib/logger.es6';

function getFullpath(filename, draft) {
  let dirname = draft === true ? '_drafts' : '_posts';

  return path.join(getPrefix(), 'source', dirname, `${filename}.md`);
}

module.exports = {
  /**
   * 按名称查找文件并读出文件内容
   *
   * @param {String} filename
   * @return {Object}
   */
  '$article.find': function (done, {filename, draft}) {
    if ( ! _.isString(filename) ) {
      return done(response(400, '文件路径不能为空'));
    }

    let filepath = getFullpath(filename, draft);

    if ( fs.exists(filepath) !== 'file' ) {
      return done(response(404, '文章不存在'));
    }

    fs
      .readAsync(filepath, 'utf8')
      .then(function (data) {
        return done(response(json(data)));
      })
      .catch(function (reason) {
        logger.error(`文章读取失败：${ reason }`);
        return done(response(500, '文章读取失败'));
      });
  },

  /**
   * 保存文章.
   *
   * @param  {String}   filename
   * @param  {Object}   article
   * @return {Object}
   */
  '$article.save': function (done, {article, filename, draft, prevState}) {
    if ( ! _.isString(filename) ) {
      return done(response(400, '文件路径不能为空'));
    }

    let filepath = getFullpath(filename, prevState);

    fs.writeAsync(filepath, markdown(article))
      .then(function () {
        let newPath = getFullpath(filename, draft);

        if (newPath !== filepath) {
          return fs.moveAsync(filepath, newPath);
        }
      })
      .then(function () {
        return done(response());
      })
      .catch(function (reason) {
        logger.error(`保存失败：${ reason }`);
        return done(response(500, '保存失败'));
      });
  },

  /**
   * 列出所有文章.
   *
   * @return {Object}
   */
  '$article.list': function (done) {
    try {
      let prefix = path.join(getPrefix(), 'source');

      glob(`${ prefix }/*(_drafts|_posts)/**.md`, function (error, data) {
        let articles = _.map(data, function (item) {
          return {
            draft: item.indexOf('_drafts') !== -1,
            title: item.replace(/\.md/, '').split('/').pop()
          };
        });

        return done(response(articles));
      });
    } catch (reason) {
      logger.error(`列表获取失败：${ reason }`);
      return done(response(500, '列表获取失败'));
    }
  },

  /**
   * 删除某篇文章.
   *
   * @param  {String}   filename
   * @return {Object}
   */
  '$article.remove': function (done, {filename, draft}) {
    let filepath = getFullpath(filename, draft);

    fs
      .removeAsync(filepath)
      .then(function () {
        return done(response(204, '删除成功'));
      })
      .catch(function (reason) {
        logger.error(`删除失败：${ reason }`);
        return done(response(500, '删除失败'));
      });
  }
};
