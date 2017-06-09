import React from 'react';
import { Form, Input, Button, Tabs } from 'element-react';

class Setting extends React.Component {
  constructor(props) {
    super( props );

    this.state = {
      activeName: "software"
    };
  }

  handleChangeDir() {
    console.log('clicked...');
  }

  handleSwitchTab({props}) {
    this.setState({
      activeName: props.name
    });
  }

  render() {
    return (
      <div className="flex-col-1 setting-container">
        <Tabs
          className="flex-col-1"
          activeName={ this.state.activeName }
          onTabClick={ this.handleSwitchTab.bind(this) }
        >
          <Tabs.Pane label="软件" name="software">
            <Form labelPosition="right" labelWidth="86">
              <Form.Item label="博客路径：">
                <Input placeholder="请设置博客路径" readOnly append={ <Button onClick={ this.handleChangeDir.bind(this) }>选择</Button> } />
              </Form.Item>
              <Form.Item label="软件更新：">
                <label>
                  <input type="checkbox" /> 自动检查更新
                </label>
              </Form.Item>
            </Form>
          </Tabs.Pane>
          <Tabs.Pane label="博客" name="blog">

          </Tabs.Pane>
        </Tabs>
      </div>
    );
  }
}

export default Setting;
