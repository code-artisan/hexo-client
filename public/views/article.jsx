import $ from 'jquery';
import React from 'react';
import _ from 'underscore';
import moment from 'moment';
import { Input, Button, Loading } from 'element-react';

import notify from '../lib/notify.es6';
import execute from '../utilities/socket.es6';
import ArticleEditor from '../components/article-editor/index.jsx';

const article = {
  body: ''
};

class ArticleView extends React.Component {
  constructor(props) {
    super( props );

    this.state = {
      article,
      loading: false
    };

    this._interval = 0;
  }

  normalize(loading = false) {
    this.setState({ loading });
  }

  _autoSaveRunner() {
    this._timer = setTimeout(() => {
      if ( this._timer ) { // 清除上一个定时器
        clearTimeout(this._timer);
      }

      this.handleSaveArticle(true);

      this._autoSaveRunner();
    }, this._interval); // 循环执行
  }

  componentDidMount() {
    this.handleFetchArticle(this.props.params); // 查询文章信息

    // 自动保存
    this
      .fetchSetting()
      .then(({result}) => {
        this._interval = result.interval;

        if ( result.autoSave === true && _.isNumber(result.interval) ) {
          this._timer = setTimeout(this._autoSaveRunner.bind(this), this._interval);
        }
      });
  }

  fetchSetting() {
    return (
      execute({
        $type: 'setting.get',
        field: ['autoSave', 'interval']
      })
    );
  }

  handleFetchArticle({filename}) {
    if (_.isString(filename)) {
      this.normalize(true);

      execute({
        $type: 'article.find',
        filename
      })
      .then(({result, code}) => {
        if ( code === 200 ) {
          this.state.article = result;
        }

        this.normalize();
      })
      .catch(this.normalize);
    } else {
      this.setState({ article });
    }
  }

  handleSaveArticle(isAutoSave = false) {
    // 文章信息处理.
    let article = {
          ...this.refs.$edtior.state.article,
          body: this.refs.$edtior.refs.body.value
        };

    if ( ! _.has(article, 'date') ) {
      article.date = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    // 自动保存不需要显示 loading.
    if ( ! isAutoSave ) {
      this.normalize(true);
    }

    let filename = this.props.params.filename || article.title;

    execute({
      $type: 'article.save',
      article,
      filename
    })
    .then(({code}) => {
      if ( isAutoSave ) return; // 自动保存不需要消息提示，防止干扰用户写作.

      this.normalize();

      if ( code === 200 ) {
        $(window).trigger('refresh');

        notify('保存文章提示', {
          body: `文章：${ filename } 保存成功`
        });

        this.props.router.replace({
          pathname: '/'
        });
      } else {
        notify('保存文章提示', {
          body: `文章：${ filename } 保存失败`
        });
      }
    })
    .catch((e) => {
      if ( isAutoSave ) return;

      notify('保存文章提示', {
        body: `文章：${ filename } 保存失败`
      });

      this.normalize();
    });
  }

  componentWillReceiveProps(nextProps) {
    this.handleFetchArticle(nextProps.params);
  }

  handleRemoveArticle() {
    $(window).trigger('article:remove', this.props.params.filename);
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  render() {
    let { date } = this.state.article;

    return (
      <div className="flex-col-1 article-editor">
        <Loading loading={ this.state.loading } className="flex-col-1" text={ this.state.message }>
          <ArticleEditor ref="$edtior" article={ this.state.article } />

          <div className="flex-row m-t-15 flex-items-middle">
            <Button type="primary" onClick={ this.handleSaveArticle.bind(this) }>保存</Button>
            { this.props.params.filename ? <Button type="danger" onClick={ this.handleRemoveArticle.bind(this) }>删除文章</Button> : null }
            <a className="el-button el-button--danger" href="#/">取消</a>
            {
              date ? ( <span className="article-date">撰写于：{ date }</span> ) : null
            }
          </div>
        </Loading>
      </div>
    );
  }
}

export default ArticleView;
