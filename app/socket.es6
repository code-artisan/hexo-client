import _ from 'underscore';
import { ipcMain } from 'electron';

function send(channel, ...args) {
  let currentWindow = BrowserWindow.getFocusedWindow();

  if ( ! currentWindow ) {
    currentWindow = BrowserWindow.getAllWindows();
    currentWindow = currentWindow && currentWindow.length && currentWindow[0];
  }

  currentWindow && currentWindow.webContents.send(channel, ...args);
};

function registry(target) {
  let keys = _.keys(target);

  _.each(keys, function (key, index) {
    if ( /^\$/.test(key) ) {
      execute(key, target);
    }
  });
}

function execute(key, target) {
  ipcMain.on(key, function ({sender}, args, uuid) {

    function callback(result) {
      if (_.isFunction(sender.send)) {
        return sender.send(`${key}-${uuid}`, result);
      }

      return send(`${key}-${uuid}`, result);
    }

    target[ key ].call(target, callback, args);
  });
}

export default registry;
