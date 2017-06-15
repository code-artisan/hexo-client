import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Button, Input, Menu, Icon, Loading } from 'element-react';
import { shell } from 'electron';
import execute from './utilities/socket.es6';

class App extends React.Component {
  constructor(props) {
    super( props );

    this.state = {
      loading: true,
      message: '',
      preview: {
        started: false,
        loading: false
      },
      keywords: '',
      articles: []
    };

    this.fetch();

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

  handlePreviewBlog() {
    let { preview } = this.state;

    this.setState({
      preview: {
        ...preview,
        loading: true
      },
      message: '正在启动...'
    });

    execute({
      $type: 'blog.start'
    })
    .then(({code}) => {
      if (code === 200) {
        preview.started = true;
        shell.openExternal('http://localhost:4000', 'blog');
      } else {
        preview.started = false;
      }

      preview.loading = false;

      this.setState({
        message: '',
        preview
      });
    }, function (e) {
      console.log(e);
      this.setState({
        message: '启动失败',
        preview: {
          started: false,
          loading: false
        }
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

  handleKillServer() {
    execute({
      $type: 'blog.stop'
    })
    .then(({code}) => {
      if (code === 200) {
        this.setState({
          preview: false
        });
      }
    })
  }

  renderPreviewIcon() {
    if (this.state.preview.started) {
      return (
        <a href="javascript:;" className="tool-item" onClick={ this.handleKillServer.bind(this) } title="停止预览">
          <i className="icon icon-hide" />
        </a>
      );
    } else {
      if (this.state.preview.loading) {
        return (
          <a href="javascript:;" className="tool-item" title="预览中"><Icon name="loading" /></a>
        );
      }

      return (
        <a href="javascript:;" className="tool-item" onClick={ this.handlePreviewBlog.bind(this) } title="预览">
          <i className="icon icon-preview" />
        </a>
      );
    }
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
            icon="search"
            value={ this.state.keywords }
            className="sidebar-search"
            placeholder="请输入关键词搜索文章"
            onChange={ this.handleChangeKeywords.bind(this) }
          />
          <Menu theme="dark" className="scroll-y">
            {
              result.map(function ({title}, index) {
                return (
                  <li key={ index }>
                    <Link
                      className="el-menu-item"
                      activeClassName="is-active"
                      to={`/article/${ title }`}
                    >
                      <i className="el-icon-message"></i> { title }
                    </Link>
                  </li>
                );
              })
            }
          </Menu>
          <div className="sidebar-tools">
            {
              this.renderPreviewIcon()
            }
            <a href="javascript:;" className="tool-item" onClick={ this.handlePublishBlog.bind(this) } title="同步">
              <i className="icon icon-upload" />
            </a>
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
