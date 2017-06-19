import $ from 'jquery';
import React from 'react';
import _ from 'underscore';
import { Input, Button, Loading } from 'element-react';

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
      loading: false,
      message: ''
    };
  }

  componentDidMount() {
    this.handleFetchArticle(this.props.params);
  }

  handleFetchArticle({filename}) {
    if (_.isString(filename)) {
      this.setState({
        loading: true
      });

      execute({
        $type: 'article.find',
        filename
      })
      .then(({result: article, code}) => {
        if ( code === 200 ) {
          this.state.article = article;
        }

        this.setState({
          loading: false
        });
      })
      .catch((error) => {
        this.setState({
          loading: false
        });
      });
    } else {
      this.setState({ article });
    }
  }

  handleSaveArticle() {
    let article = {
          ...this.refs.$edtior.state.article,
          body: this.refs.$edtior.refs.body.value
        };

    this.setState({
      loading: true,
      message: '正在保存...'
    });

    execute({
      $type: 'article.save',
      article,
      filename: this.props.params.filename || article.title
    })
    .then(({code}) => {
      this.setState({
        loading: false,
        message: code === 200 ? '保存成功' : '保存失败'
      });

      if ( code === 200) {
        $(window).trigger('refresh');

        this.props.router.replace({
          pathname: '/'
        });
      }
    }, (e) => {
      this.setState({
        loading: false,
        message: '保存失败'
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.handleFetchArticle(nextProps.params);
  }

  render() {
    return (
      <div className="flex-col-1 article-editor">
        <Loading loading={ this.state.loading } className="flex-col-1" text={ this.state.message }>
          <ArticleEditor ref="$edtior" article={ this.state.article } />

          <div className="flex-row m-t-15">
            <Button type="primary" onClick={ this.handleSaveArticle.bind(this) }>保存</Button>
            <a className="el-button el-button--danger" href="#/">取消</a>
          </div>
        </Loading>
      </div>
    );
  }
}

export default ArticleView;
