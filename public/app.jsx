import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Button, Input, Menu, Icon, Loading } from 'element-react';

import execute from './utilities/socket.es6';

class App extends React.Component {
  constructor(props) {
    super( props );

    this.state = {
      loading: true,
      articles: []
    };
  }

  componentWillMount() {
    execute({
      $type: 'article.list'
    }).then(({result: articles, code}) => {
      if (code === 200) {
        this.setState({
          articles,
          loading: false
        });
      }
    }).catch(() => {
      this.setState({
        loading: false
      });
    });
  }

  render() {
    return (
      <Loading className="flex-row-1" loading={ this.state.loading } fullscreen>
        <div className="flex-col sidebar">
          <Input className="sidebar-search" icon="search" placeholder="请输入关键词搜索文章" />
          <Menu theme="dark" className="scroll-y">
            {
              this.state.articles.map(function ({title}, index) {
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
          <Link to="/article" className="create-article-button">
            <Icon name="plus" />
          </Link>
        </div>
        { this.props.children }
      </Loading>
    );
  }
}

export default App;
