import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import { Loading, Button, Tabs, Form, Input } from 'element-react';
import execute from '../utilities/socket.es6';
import notify from '../lib/notify.es6';

const rules = {
  prefix: [
    { required: true, message: '请设置博客路径', trigger: 'change' }
  ],
  url: [
    { required: true, message: '请设置博客地址', trigger: 'change' }
  ],
  dirname: [
    { required: true, message: '请设置目录名称', trigger: 'change' }
  ]
};

class InstallView extends React.Component {
  constructor(props) {
    super( props );

    this.state = {
      url: '',
      prefix: '',
      dirname: '',
      pending: false,
      message: null
    };

    $(document).on('selectstart', () => false);
  }

  redirect2index(code) {
    this.setState({
      pending: false
    });

    if (code === 200) {
      this.props.router.replace({
        pathname: '/'
      });
    }
  }

  handleSetDirname(dirname) {
    this.setState({ dirname });
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

  handleSaveSetting(form, event) {
    event.preventDefault();

    const isNewForm = form === 'form-new';

    this.refs[form].validate((valid) => {
      if ( valid === false ) return;

      let message = isNewForm ? '正在初始化博客' : '正在加载博客数据';

      if (isNewForm) {
        this.setState({
          message,
          pending: true,
        });
      }

      let setting = _.omit(this.state, ['pending', 'dirname']);

      if ( isNewForm ) {
        setting.prefix += `/${this.state.dirname}`;
      }

      execute({
        $type: 'setting.set',
        setting
      })
      .then(({code}) => {
        if ( isNewForm ) {
          return execute({
            $type: 'blog.init'
          });
        }

        this.setState({
          pending: false
        });

        this.redirect2index(code);
      })
      .then((res) => {
        if (res && res.code) {
          this.setState({
            pending: false
          });

          let title = '初始化博客',
              isFaild = res.code !== 200;

          if ( isFaild === true ) {
            title += '失败';
          } else {
            title += '成功';
            this.redirect2index(res.code);
          }

          notify(title, {
            body: res.message
          });
        }
      })
      .catch((e) => {
        notify('初始化博客', {
          body: `博客初始化失败`
        });
      });
    });
  }

  handleSwitchTab(tab) {
    if (tab.props.name === '2') {
      this.state.url = '';
    }
  }

  render() {
    return (
      <div className="flex-col-1 flex-items-center install-container">
        <div className="flex-center">
          <Loading loading={ this.state.pending } text={ this.state.message }>
            <Tabs onTabClick={ this.handleSwitchTab.bind(this) }>
              <Tabs.Pane label="已有博客" name="1">
                <Form ref="form-exists" model={ this.state } labelPosition="right" labelWidth="92" rules={ rules }>
                  <Form.Item prop="prefix" label="博客路径：">
                    <Input placeholder="请设置博客路径" size="small" value={ this.state.prefix } readOnly append={ <Button disabled={ this.state.pending } onClick={ this.handleChangeDir.bind(this) }>选择</Button> } />
                  </Form.Item>
                  <Form.Item prop="url" label="博客地址：">
                    <Input placeholder="请设置博客地址" size="small" value={ this.state.url } onChange={ this.handleSetBlogURL.bind(this) } />
                  </Form.Item>
                  <Form.Item labelWidth="0">
                    <Button type="primary" size="small" nativeType="submit" onClick={ this.handleSaveSetting.bind(this, 'form-exists') }>开始写作</Button>
                  </Form.Item>
                </Form>
              </Tabs.Pane>

              <Tabs.Pane label="新建博客" name="2">
                <Form ref="form-new" model={ this.state } labelPosition="right" labelWidth="92" rules={ rules }>
                  <Form.Item prop="prefix" label="博客路径：">
                    <Input placeholder="请设置博客路径" size="small" value={ this.state.prefix } readOnly append={ <Button disabled={ this.state.pending } onClick={ this.handleChangeDir.bind(this) }>选择</Button> } />
                  </Form.Item>
                  <Form.Item prop="dirname" label="目录名称：">
                    <Input placeholder="请设置目录名称" size="small" value={ this.state.dirname } disabled={ this.state.pending } onChange={ this.handleSetDirname.bind(this) } />
                  </Form.Item>
                  <Form.Item labelWidth="0">
                    <Button type="primary" size="small" nativeType="submit" onClick={ this.handleSaveSetting.bind(this, 'form-new') }>开始写作</Button>
                  </Form.Item>
                </Form>
              </Tabs.Pane>
            </Tabs>
          </Loading>
        </div>
      </div>
    );
  }
}

export default InstallView;
