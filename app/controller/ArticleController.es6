import fs from 'fs';
import path from 'path';
import glob from 'glob';
import _ from 'underscore';
import response from '../response.es6';

const prefix = '/usr/local/var/www/blog.codeartisan.name/source/_posts';

function getFullpath(filepath) {
  return path.join(prefix, `${filepath}.md`);
}

function formatter(article) {
  article = article.replace('---\n', '');

  let array  = article.split('---'),
      meta   = array.shift(),
      result = {
        body: array.pop().replace(/^(\n)*/, '')
      };

  meta.split('\n').forEach(function (value) {
    if (value.indexOf(':') !== -1) {
      let arr = value.split(':'),
          key = arr[0],
          val = arr.slice(1).join(':');

      if ( key === 'tags' ) {
        val = val.replace(/\[|\]/g, '');
      }

      result[ key ] = val.trim();
    }
  });

  return result;
}

module.exports = {
  '$article.find': function (done, {filepath}) {
    if ( ! _.isString(filepath) ) {
      return done(response(400, '文件路径不能为空'));
    }

    filepath = getFullpath(filepath);

    if ( fs.existsSync(filepath) === false ) {
      return done(response(404, '该文章不存在'));
    }

    fs.readFile(filepath, 'utf8', function (error, data) {
      if (error) new Erorr(error);

      try {
        done(response(formatter(data)));
      } catch (error) {
        done(response(500, '文章读取失败'));
      }
    });
  },

  '$article.save': function (done, {filepath, article}) {
    if ( ! _.isString(filepath) ) {
      return done(response(400, '文件路径不能为空'));
    }

    filepath = getFullpath(filepath);

    let content = `---
title: ${ article.title.trim() }
date: ${ article.date.trim() }
tags: [${ article.tags.trim() }]
---\n\r${ article.body.trim() }`;

    fs.writeFile(filepath, content, 'utf8', function (error, data) {
      if (error) {
        console.log(error);
      } else {
        return done(response(200));
      }
    });
  },

  '$article.list': function (done) {
    glob(`${prefix}/**.md`, function (error, data) {
      if (error) {
        console.log(error);
      }

      let articles = _.map(data, function (item) {
        return {
          title: item.replace(/\.md/, '').split('/').pop()
        };
      });

      return done(response(articles));
    });
  },

  '$article.remove': function (done, {filepath}) {
    filepath = getFullpath(filepath);

    fs.unlink(filepath, function (err, data) {
      return done(response(204, '删除成功'));
    });
  }
};
