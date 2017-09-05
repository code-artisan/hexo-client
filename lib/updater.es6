/**
 * updater.js
 *
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

let updater;

autoUpdater.autoDownload = false;

autoUpdater.on('error', (event, error) => {
  dialog.showErrorBox('更新失败: ', error == null ? "未知错误" : (error.stack || error).toString());
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: '发现新版本',
    message: '发现新版本，是否更新到最新版本？',
    buttons: ['更新', '取消']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate();
    } else {
      updater.enabled = true;
      updater = null;
    }
  });
});

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: '未发现更新',
    message: '当前已是最新版本'
  });

  updater.enabled = true;
  updater = null;
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: '正在安装更新',
    message: '下载完成, 更新完成后将重新启动客户端...'
  }, () => {
    setImmediate(() => autoUpdater.quitAndInstall());
  });
});

// export this to MenuItem click callback
module.exports = function (menuItem, focusedWindow, event) {
  updater = menuItem;
  updater.enabled = false;
  autoUpdater.checkForUpdates();
};
