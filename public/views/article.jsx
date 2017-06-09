import React from 'react';
import _ from 'underscore';
import { Input, Button, Loading } from 'element-react';

import execute from '../utilities/socket.es6';

import ArticleEditor from '../components/article-editor.jsx';

class ArticleView extends React.Component {
  constructor(props) {
    super( props );

    this.state = {
      article: {}
    };
  }

  componentDidMount() {
    this.handleFetchArticle(this.props.params);
  }

  handleFetchArticle({filepath}) {
    if (_.isString(filepath)) {
      this.setState({
        loading: true
      });

      execute({
        $type: 'article.find',
        filepath
      }).then(({result: article, code}) => {
        if ( code === 200 ) {
          this.setState({
            article,
            loading: false
          });
        }
      }).catch(function (error) {
        this.setState({
          loading: false
        });
      });
    }
  }

  handleSaveArticle() {
    let { filepath } = this.props.params;

    execute({
      $type: 'article.save',
      filepath,
      article: this.state.article
    }).then(({result, code}) => {
      console.log(result, code);
    }).catch(function (error) {
      console.log(error);
    });
  }

  componentWillReceiveProps(nextProps) {
    this.handleFetchArticle(nextProps.params);
  }

  render() {
    return (
      <div className="flex-col-1 article-editor">
        <Loading loading={ this.state.loading } className="flex-col-1">
          <ArticleEditor article={ this.state.article } />

          <div className="flex-row m-t-15">
            <Button type="primary" onClick={ this.handleSaveArticle.bind(this) }>发布</Button>
            <Button type="danger">取消</Button>
          </div>
        </Loading>
      </div>
    );
  }
}

export default ArticleView;
