import url from 'url';
import path from 'path';
import { app, shell, BrowserWindow } from 'electron';
import { ASSETS_PATH } from './global.es6';
import setting from '../../lib/setting.es6';

const name = app.getName();

module.exports = [
  {
    label: 'Hexo Client',
    role: name,
    submenu: [
      {
        role: 'about',
        label: `关于${ name }`
      }, {
        type: 'separator'
      }, {
        role: 'services',
        label: '偏好设置',
        accelerator: 'CmdOrCtrl+,',
        click: setting
      }, {
        type: 'separator'
      }, {
        label: '隐藏其它',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      }, {
        label: '显示全部',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        role: 'quit',
        label: '退出'
      }
    ]
  }, {
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      }, {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      }, {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      }, {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      }, {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  }, {
    role: 'window',
    label: '窗口',
    submenu: [
      {
        role: 'close',
        label: '关闭窗口'
      },
      {
        role: 'minimize',
        label: '最小化'
      },
      {
        type: 'separator'
      },
      {
        role: 'front',
        label: '窗口前置'
      }
    ]
  }, {
    label: '帮助',
    role: 'help',
    submenu: [
      {
        label: '仓库地址',
        click() {
          shell.openExternal('https://github.com/code-artisan');
        }
      },
      {
        label: '关于作者',
        click() {
          shell.openExternal('http://blog.codeartisan.name');
        }
      },
      {
        label: '反馈建议',
        click() {
          shell.openExternal('http://github.com')
        }
      }
    ]
  }
];
