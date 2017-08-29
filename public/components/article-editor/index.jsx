import React from 'react';
import _ from 'underscore';
import { Input } from 'element-react';
import pangu from 'pangu';
import { ipcRenderer as ipc, shell } from 'electron';

import './index.scss';
import 'codemirror/lib/codemirror.css';
import editormd from '../../lib/editormd.js';

class ArticleEditor extends React.Component {
  static defaultProps = {
    article: {
      tags: []
    }
  };

  constructor(props) {
    super( props );

    this.state = {
      article: props.article
    };

    this._shouldUpdateEditor = true;

    this._editor = null;

    this._delegateLinkClick = this._delegateLinkClick.bind(this);
  }

  componentDidMount() {
    this.handleMountEditor();

    $(this.refs.editor).on('click', 'a', this._delegateLinkClick);
  }

  _delegateLinkClick(event) {
    event.preventDefault();

    shell.openExternal(event.target.href);
  }

  handleMountEditor() {
    let editor = null,
        { article } = this.state,
        textarea = this.refs.body;

    if ( _.has(article, 'body') ) {
      this._editor = editor = editormd('editormd', {
        emoji: true,
        path: '../lib/',
        value: article.body,
        taskList: true,
        autoFocus: false,
        searchReplace: false,
        autoLoadModules: false,
        saveHTMLToTextarea: true,
        toolbarIconsClass: {
          docs: 'fa-file',
          spacing: 'fa-paragraph'
        },
        lang: {
          toolbar: {
            docs: '关于编辑器',
            spacing: '中英文之间插入空格'
          }
        },
        toolbarHandlers: {
          docs: function () {
            return shell.openExternal('https://pandao.github.io/editor.md/index.html');
          },
          spacing: () => {
            let body = pangu.spacing(editor.getValue()),
                { article } = this.state;

            this.setState({
              article: {
                ...article,
                body
              }
            });

            editor.setValue(body);
          }
        },
        onload: function () {
          $('.CodeMirror-scroll').on('contextmenu', function () {
            return ipc.send('show-editor-context-menu');
          });
        },
        onchange: function () {
          article.body = this.getValue();
        }
      });

      editor.setValue(article.body);
    }
  }

  componentDidUpdate() {
    let { _shouldUpdateEditor } = this;

    if (_shouldUpdateEditor) {
      this._editor.clear();
      this.handleMountEditor();
      this._shouldUpdateEditor = false;
    }
  }

  componentWillReceiveProps({article}) {
    this.state.article = article;

    let prevArticle = this.props.article;

    if (
      prevArticle.title !== article.title
    ) {
      this._shouldUpdateEditor = true;
    }
  }

  componentWillUnmount() {
    this._editor.clear();
    this._editor = null;

    $(this.refs.editor).off('click', 'a', this._delegateLinkClick);
  }

  handleChange(field, value) {
    let { article } = this.state;

    this.setState({
      article: {
        ...article,
        [ field ]: value
      }
    });
  }

  render() {
    let { article } = this.state;

    return (
      <div className="flex-col-1">
        <Input placeholder="请输入文章标题" prepend="标&#x3000;题" value={ article.title } onChange={ this.handleChange.bind(this, 'title') } />
        <Input placeholder="请输入关键词，多个请用英文逗号 ',' 隔开" prepend="关键词" value={ article.tags } onChange={ this.handleChange.bind(this, 'tags') } />

        <div ref="editor" id="editormd" className="pure-u-1 el-input">
          <textarea ref="body" className="d-hide" value={ article.body || '' } onChange={ () => {} } />
        </div>
      </div>
    );
  }
}

export default ArticleEditor;
