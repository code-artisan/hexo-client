import url from 'url';
import path from 'path';
import fs from 'fs-jetpack';
// import glob from 'glob';
import { app, BrowserWindow, Menu, MenuItem, ipcMain as ipc } from 'electron';
import { autoUpdater } from 'electron-updater';

import { ASSETS_PATH } from './app/config/global.es6';
import registry from './lib/socket.es6';
import template from './app/config/menu.es6';
import { getPrefix } from './lib/utilities.es6';

import editorMenu from './app/config/context/editor.es6';

import BlogController from './app/controllers/BlogController.es6';
import WindowController from './app/controllers/WindowController.es6';
import ArticleController from './app/controllers/ArticleController.es6';
import SettingController from './app/controllers/SettingController.es6';

let mainWindow = null;

function sendStatusToWindow(message) {
  mainWindow.webContents.send('message', message);
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Hexo 客户端',
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'build', 'icon.ico')
  });

  let prefix = getPrefix(),

      file = url.format({
        pathname: path.join(ASSETS_PATH, 'index.html'),
        protocol: 'file:',
        slashes: true,
        hash: typeof prefix === 'string' && prefix.length !== 0 ? '#/' : '#/install'
      });

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // and load the index.html of the app.
  mainWindow.loadURL(file);

  if (process.env.NODE_ENV === 'development') {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

app.on('ready', function () {
  // glob('./app/controller/**Controller.es6', function (error, result) {
  //   result.forEach(function (filepath) {

  //     filepath = filepath.replace('./app/', './');
  //     console.log( filepath, filepath === './controller/ArticleController.es6', require(filepath), require('./controller/ArticleController.es6') );

  //     registry(require(filepath));
  //   });
  // });

  createWindow();

  registry(BlogController);
  registry(WindowController);
  registry(ArticleController);
  registry(SettingController);
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

ipc.on('show-editor-context-menu', function ({sender}) {
  const win = BrowserWindow.fromWebContents(sender);

  editorMenu.popup( win );
});

// app.on('browser-window-created', function (event, win) {
//   win.webContents.on('context-menu', function (e, params) {
//     if (params.linkText) {
//       parameters = params;
//     }

//     contextMenu.popup(win, params.x, params.y);
//   });
// });

// autoUpdater
//   .on('updater-downloaded', function () {
//     autoUpdater.quitAndInstall();
//   })
//   .on('checking-for-update', () => {
//     sendStatusToWindow('正在检查更新...');
//   })
//   .on('update-available', (ev, info) => {
//     sendStatusToWindow('Update available.');
//   })
//   .on('update-not-available', (ev, info) => {
//     sendStatusToWindow('已经是最新版本.');
//   })
//   .on('error', (ev, err) => {
//     sendStatusToWindow('更新失败.');
//   })
//   .on('download-progress', (progressObj) => {
//     let log_message = "正在下载: " + progressObj.bytesPerSecond;
//     log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
//     log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';

//     sendStatusToWindow(log_message);
//   })
//   .on('update-downloaded', (ev, info) => {
//     sendStatusToWindow('下载完成，正在更新并重启...');
//   });
