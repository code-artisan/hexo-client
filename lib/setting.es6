import url from 'url';
import path from 'path';
import { app, shell, BrowserWindow } from 'electron';
import { ASSETS_PATH } from '../app/config/global.es6';

module.exports = function () {
  let file = url.format({
        pathname: path.join(ASSETS_PATH, 'index.html'),
        protocol: 'file:',
        slashes: true,
        hash: '/setting'
      });

  let window = new BrowserWindow({
        width: 440,
        height: 240,
        title: '偏好设置',
        // resizable: false,
        darkTheme: true,
        minimizable: false,
        maximizable: false
      });

  window.loadURL( file );
  window.setMenu( null );

  if (process.env.NODE_ENV === 'development') {
    window.webContents.openDevTools();
  }
};
