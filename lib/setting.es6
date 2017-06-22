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
        hash: '/setting'
      });

  let window = new BrowserWindow({
        width: 400,
        height: 200,
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
