import url from 'url';
import path from 'path';
import { app, BrowserWindow } from 'electron';
import { ASSETS_PATH } from '../app/config/global.es6';

module.exports = function () {
  const isDevelopment = process.env.NODE_ENV;

  let file = url.format({
        pathname: path.join(ASSETS_PATH, 'index.html'),
        protocol: 'file:',
        slashes: true,
        hash: '/about'
      });

  let window = new BrowserWindow({
        width: 283,
        height: 175,
        title: '关于 Hexo 客户端',
        resizable: ! isDevelopment,
        darkTheme: true,
        minimizable: false,
        maximizable: false
      });

  window.loadURL( file );
  window.setMenu( null );

  if ( isDevelopment ) {
    window.webContents.openDevTools();
  }
};
