import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { ipcRenderer as ipc, remote } from 'electron';
import { Button, Input, Menu as Sidebar, Icon, Loading } from 'element-react';
import { shell } from 'electron';
import execute from './utilities/socket.es6';

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

    this.fetch();

    this.getBlogURL();

    $(window).on('refresh', this.fetch.bind(this));
  }

  fetch() {
    execute({
      $type: 'article.list'
    })
    .then(({result: articles, code}) => {
      if (code === 200) {
        this.state.articles = articles;
      }

      this.setState({
        loading: false
      });
    })
    .catch(() => {
      this.setState({
        loading: false
      });
    });
  }

  refresh() {
    this.setState({
      loading: true
    });

    setTimeout(this.fetch.bind(this), 200);
  }

  getBlogURL() {
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
    .then(({code}) => {
      this.setState({
        loading: false
      });
    }, function (e) {
      this.setState({
        loading: false
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

  handleRemoveArticle(filename) {
    execute({
      $type: 'article.remove',
      filename
    })
    .then((res) => {
      if (res.code === 204) {
        this.refresh();

        this.props.router.replace({
          pathname: '/'
        });
      }
    });
  }

  registryContextMenu() {
    menu.append(new MenuItem({
      label: '编辑',
      click: () => {
        console.log(this.pathname);
        this.props.router.replace({
          pathname: this.pathname
        });
      }
    }));

    menu.append(new MenuItem({
      type: 'separator'
    }));

    menu.append(new MenuItem({
      label: '删除',
      click: () => {
        let pathname = this.pathname.split('/').pop();

        this.handleRemoveArticle( pathname );
      }
    }));
  }

  componentDidMount() {
    this.registryContextMenu();

    let node = ReactDOM.findDOMNode(this.refs.menu);

    $(node).on('contextmenu', (event) => {
      event.preventDefault();

      this.pathname = event.target.hash.trim().substr(1);

      menu.popup(remote.getCurrentWindow());
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
            {
              result.map(({title}, index) => {
                return (
                  <li key={ index }>
                    <Link
                      className="el-menu-item"
                      activeClassName="is-active"
                      to={`/article/${ title }`}
                    >
                      <i className="icon icon-article"></i> { title }
                    </Link>
                  </li>
                );
              })
            }
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
            <a href="javascript:;" className="tool-item" onClick={ this.refresh.bind(this) } title="刷新列表">
              <i className="icon icon-refresh" />
            </a>
            <a href="#/article" className="tool-item" title="撰写文章">
              <i className="icon icon-plus" />
            </a>
          </div>
        </div>
        { this.props.children }
      </Loading>
    );
  }
}

export default App;
