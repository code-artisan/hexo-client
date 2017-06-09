import React from 'react';
import _ from 'underscore';
import { Input } from 'element-react';

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

        <Input
          type="textarea"
          placeholder="请输入文章正文"
          className="flex-col-1"
          value={ article.body }
          onChange={ this.handleChange.bind(this, 'body') }
        />
      </div>
    );
  }
}

export default ArticleEditor;
