import $ from 'jquery';
import React from 'react';
import { Form, Input, Button, Tabs } from 'element-react';

import execute from '../utilities/socket.es6';

class Setting extends React.Component {
  constructor(props) {
    super( props );

    this.state = {
      url: '',
      prefix: ''
    };

    execute({
      $type: 'setting.get',
      field: ['prefix', 'url']
    })
    .then(({result}) => {
      this.setState(result);
    });
  }

  handleChangeDir(prefix) {
    execute({
      $type: 'window.dialog',
      title: '设置博客路径',
      properties: ['openDirectory']
    })
    .then(({result: prefix}) => {
      if (prefix.length !== 0) {
        this.setState({ prefix });
      }
    });
  }

  handleSetBlogURL(url) {
    this.setState({ url });
  }

  handleSaveSetting() {
    execute({
      $type: 'setting.set',
      setting: this.state
    }).then(({code}) => {
      if (code === 200) {
        window.close();
      }
    });
  }

  render() {
    return (
      <div className="flex-col-1 setting-container flex-items-center">
        <Form labelPosition="right" labelWidth="86">
          <Form.Item label="博客路径：">
            <Input placeholder="请设置博客路径" size="small" value={ this.state.prefix } readOnly append={ <Button onClick={ this.handleChangeDir.bind(this) }>选择</Button> } />
          </Form.Item>
          <Form.Item label="博客地址：">
            <Input placeholder="请设置博客地址" size="small" value={ this.state.url } onChange={ this.handleSetBlogURL.bind(this) } />
          </Form.Item>
          {
            /*
              <Form.Item label="软件更新：">
                <label className="el-checkbox"><input type="checkbox" /> 自动检查更新</label>
              </Form.Item>
             */
          }
          <Form.Item className="fixed-bottom">
            <div className="pull-right">
              <button className="form-btn" onClick={ () => window.close() }>取消</button>
              <input className="form-btn" type="submit" value="应用" onClick={ this.handleSaveSetting.bind(this) } />
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Setting;
