import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { ipcRenderer as ipc, remote, shell } from 'electron';
import { Button, Input, Menu as Sidebar, Icon, Loading, Tooltip } from 'element-react';
import execute from './utilities/socket.es6';
import notify from './lib/notify.es6';

const {
  Menu,
  MenuItem
} = remote;

const menu = new Menu();

class App extends React.Component {
  pathname = '';

  constructor(props) {
    super( props );

    this.state = {
      loading: true,
      message: '',
      keywords: '',
      articles: []
    };

    this._url = null;

    this._fetch();

    this._getBlogURL();

    $(window)
      .on('refresh', this._fetch.bind(this))
      .on('article:remove', this._removeArticle.bind(this));
  }

  normalize() {
    this.setState({
      loading: false
    });
  }

  _fetch() {
    execute({
      $type: 'article.list'
    })
    .then(({result, code}) => {
      if (code === 200) {
        this.state.articles = result;
      }

      return this.normalize();
    })
    .catch((e) => {
      return this.normalize();
    });
  }

  _refresh() {
    this.setState({
      loading: true
    });

    setTimeout(this._fetch.bind(this), 200);
  }

  _getBlogURL() {
    execute({
      $type: 'setting.get',
      field: 'url'
    })
    .then(({result}) => {
      this._url = result;
    });
  }

  handlePublishBlog() {
    this.setState({
      loading: true,
      message: '正在发布...'
    });

    this.state.message = '';

    execute({
      $type: 'blog.deploy'
    })
    .then(({code, message}) => {
      this.normalize();

      if ( code === 200 ) {
        notify('发布文章', { body: '文章发布成功' });
      } else {
        notify('发布失败', { body: message })
      }
    })
    .catch((error) => {
      this.normalize();

      notify('发布文章', {
        body: `文章发布失败`
      });
    });
  }

  handleOpenSettingWindow() {
    execute({
      $type: 'setting.open'
    });
  }

  handleChangeKeywords(keywords) {
    this.setState({ keywords });
  }

  handlePreviewBlog() {
    shell.openExternal(this._url);
  }

  /**
   * 删除文章.
   *
   * @param  {Object} event
   * @param  {String} filename
   * @param  {Boolean} draft
   * @return {Undefined}
   */
  _removeArticle(event, {filename, draft}) {
    if (confirm(`确定要删除 ${ filename } 这篇文章？`)) {
      execute({
        $type: 'article.remove',
        draft: draft === '1',
        filename
      })
      .then((res) => {
        if (res.code === 204) {
          notify('删除文章提示', {
            body: `文章：${ filename } 已被删除`
          });

          this._refresh();

          this.props.router.replace({
            pathname: '/'
          });
        }
      });
    }
  }

  handleRemoveArticle(filename, draft) {
    $(window).trigger('article:remove', {filename, draft});
  }

  _registryContextMenu() {
    menu.append(new MenuItem({
      label: '编辑文章',
      click: () => {
        this.props.router.replace({
          pathname: this.pathname
        });
      }
    }));

    menu.append(new MenuItem({
      type: 'separator'
    }));

    menu.append(new MenuItem({
      label: '删除文章',
      click: () => {
        let params = this.pathname.split('/'),
            draft = params.pop(),
            pathname = params.pop();

        this.handleRemoveArticle( pathname, draft );
      }
    }));
  }

  componentDidMount() {
    this._registryContextMenu();

    let node = ReactDOM.findDOMNode(this.refs.menu);

    $(node)
      .on('dragstart'  , () => false)
      .on('contextmenu', (event) => {
        event.preventDefault();

        this.pathname = event.target.hash.trim().substr(1);

        menu.popup(remote.getCurrentWindow());
      });
  }

  renderSidebar(resource) {
    if (resource.length === 0) {
      if (this.state.keywords.length === 0) {
        return (
          <li className="el-menu-msgs">暂无文章 &nbsp;
            <Link to="/article/0" className="tool-item" title="撰写文章">
              <i className="icon icon-plus" />
            </Link>
          </li>
        );
      }

      return (<li className="el-menu-msgs">没有匹配的文章</li>);
    }

    return resource.map(({title, draft}, index) => {
      draft = + draft;

      return (
        <li key={ index }>
          <Tooltip effect="dark" content={ title } placement="right">
            <Link
              className="el-menu-item"
              activeClassName="is-active"
              to={`/article/${ title }/${ draft }`}
            >
              { draft === 1 ? <i className="icon icon-draft"></i> : <i className="icon icon-article"></i> } { title }
            </Link>
          </Tooltip>
        </li>
      );
    });
  }

  render() {
    let { articles, keywords } = this.state;

    let result = _.filter(articles, function (article) {
      return article.title.indexOf( keywords ) !== -1;
    });

    return (
      <Loading className="flex-row-1" loading={ this.state.loading } fullscreen text={ this.state.message }>
        <div className="flex-col sidebar">
          <Input
            icon={
              <i className="el-input__icon icon icon-search" />
            }
            value={ this.state.keywords }
            className="sidebar-search"
            placeholder="请输入关键词搜索文章"
            onChange={ this.handleChangeKeywords.bind(this) }
          />
          <Sidebar theme="dark" className="scroll-y" ref="menu">
            { this.renderSidebar(result) }
          </Sidebar>
          <div className="sidebar-tools">
            {
              this._url ? (
                <a href="javascript:;" className="tool-item" onClick={ this.handlePreviewBlog.bind(this) } title="打开博客">
                  <i className="icon icon-preview" />
                </a>
              ) : null
            }
            <a href="javascript:;" className="tool-item" onClick={ this.handleOpenSettingWindow.bind(this) } title="偏好设置">
              <i className="icon icon-setting" />
            </a>
            <a href="javascript:;" className="tool-item" onClick={ this.handlePublishBlog.bind(this) } title="编译发布">
              <i className="icon icon-upload" />
            </a>
            <a href="javascript:;" className="tool-item" onClick={ this._refresh.bind(this) } title="刷新列表">
              <i className="icon icon-refresh" />
            </a>
            <Link to="/article" className="tool-item" title="撰写文章">
              <i className="icon icon-plus" />
            </Link>
          </div>
        </div>
        { this.props.children }
      </Loading>
    );
  }
}

export default App;
