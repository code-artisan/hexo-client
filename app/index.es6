import url from 'url';
import path from 'path';
import glob from 'glob';
import { app, BrowserWindow, Menu } from 'electron';
import registry from './socket.es6';
import template from './menu.es6';
import WindowController from './controller/WindowController.es6';
import ArticleController from './controller/ArticleController.es6';
import SettingController from './controller/SettingController.es6';

let mainWindow = null;

function createWindow() {
  // Create the browser window.
  mainWindow =  new BrowserWindow({
                  minWidth: 800,
                  minHeight: 600,
                  icon: path.join(__dirname, 'assets', 'icon.png')
                });

  let file = url.format({
    pathname: path.join(__dirname, 'assets', 'index.html'),
    protocol: 'file:',
    slashes: true
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // and load the index.html of the app.
  mainWindow.loadURL(file);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

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

  registry(WindowController);
  registry(ArticleController);
  registry(SettingController);

  createWindow();
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
