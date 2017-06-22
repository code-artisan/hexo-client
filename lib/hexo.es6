import _ from 'underscore';

let Hexo = {

  /**
   * 把 markdown 文件内容转换成 JSON 格式.
   *
   * @param  {String} article
   * @return {Object}
   */
  json(article) {
    let temp = article.replace('---\n', '').split('---'),
        meta = temp.shift().split('\n'),
        body = temp.pop().replace(/^(\n)*/, '').trim(),
        result = {};

    meta.forEach(function (value) {
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

    return Object.assign(result, { body });
  },

  /**
   * 把 JSON 对象的文章转换成 markdown 格式.
   *
   * @param  {Object} article
   * @return {String}
   */
  markdown(article) {
    return `---\ntitle: ${ (article.title || '').trim() }\ndate: ${ (article.date || '').trim() }\ntags: [${ (article.tags || '').trim() }]\n---\n\n${ (article.body || '').trim() }`;
  }
};

module.exports = Hexo;
