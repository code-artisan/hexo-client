import React from 'react';
import execute from '../utilities/socket.es6';

class IndexView extends React.Component {
  handleClick() {
    execute({
      $type: 'blog.init'
    })
    .then(function (data) {
      console.log(data);
    });
  }

  render() {
    return (
      <div className="flex-col-1 flex-items-center">
        <div className="flex-center">
          <a href="#/article" className="el-button el-button--primary">添加文章</a>
          <button onClick={ this.handleClick.bind(this) } className="el-button el-button--primary">测试</button>
        </div>
      </div>
    );
  }
}

export default IndexView;
