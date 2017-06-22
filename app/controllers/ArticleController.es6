import fs from 'fs-jetpack';
import path from 'path';
import glob from 'glob';
import _ from 'underscore';
import response from '../../lib/response.es6';
import { getPrefix } from '../../lib/utilities.es6';
import { json, markdown } from '../../lib/hexo.es6';

function getFullpath(filename) {
  return path.join(getPrefix(), 'source', '_posts', `${filename}.md`);
}

module.exports = {
  /**
   * 按名称查找文件并读出文件内容
   *
   * @param {String} filename
   * @return {Object}
   */
  '$article.find': function (done, {filename}) {
    if ( ! _.isString(filename) ) {
      return done(response(400, '文件路径不能为空'));
    }

    let filepath = getFullpath(filename);

    if ( fs.exists(filepath) !== 'file' ) {
      return done(response(404, '文章不存在'));
    }

    fs
      .readAsync(filepath, 'utf8')
      .then(function (data) {
        return done(response(json(data)));
      })
      .catch(function (e) {
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
  '$article.save': function (done, {article, filename}) {
    if ( ! _.isString(filename) ) {
      return done(response(400, '文件路径不能为空'));
    }

    let filepath = getFullpath(filename),
        content  = markdown(article);

    fs
      .writeAsync(filepath, content)
      .then(function () {
        return done(response());
      })
      .catch(function () {
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
      let prefix = path.join(getPrefix(), 'source', '_posts');

      glob(`${ prefix }/**.md`, function (error, data) {
        let articles = _.map(data, function (item) {
          return {
            title: item.replace(/\.md/, '').split('/').pop()
          };
        });

        return done(response(articles));
      });
    } catch (e) {
      return done(response(500));
    }
  },

  /**
   * 删除某篇文章.
   *
   * @param  {String}   filename
   * @return {Object}
   */
  '$article.remove': function (done, {filename}) {
    let filepath = getFullpath(filename);

    fs
      .removeAsync(filepath)
      .then(function () {
        return done(response(204, '删除成功'));
      })
      .catch(function (e) {
        return done(response(500, '删除失败'));
      });
  }
};
