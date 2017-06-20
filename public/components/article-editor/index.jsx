import React from 'react';
import _ from 'underscore';
import { shell } from 'electron';
import { Input } from 'element-react';
import { ipcRenderer as ipc } from 'electron';

import './index.scss';
import 'codemirror/lib/codemirror.css';
import editormd from '../../lib/editor.md';

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
  }

  componentDidMount() {
    this.handleMountEditor();
  }

  handleMountEditor() {
    let { article } = this.state;

    if ( _.has(article, 'body') ) {
      editormd('editormd', {
        emoji: true,
        path: '../lib/',
        autoFocus: false,
        searchReplace: false,
        autoLoadModules: false,
        saveHTMLToTextarea: true,
        toolbarIconsClass: {
          docs: 'fa-file'
        },
        lang: {
          toolbar: {
            docs: '关于编辑器'
          }
        },
        toolbarHandlers: {
          docs: function () {
            return shell.openExternal('https://pandao.github.io/editor.md/index.html');
          }
        },
        onload: function () {
          $('.CodeMirror-code').on('contextmenu', function () {
            return ipc.send('show-editor-context-menu');
          });
        },
        onchange: function () {
          article.body = this.getValue();
        }
      });
    }
  }

  componentDidUpdate() {
    this.handleMountEditor();
  }

  componentWillReceiveProps(nextProps) {
    this.state.article = nextProps.article;
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
          <textarea ref="body" className="d-hide" value={ article.body } />
        </div>
      </div>
    );
  }
}

export default ArticleEditor;
