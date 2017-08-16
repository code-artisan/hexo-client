import fs from 'fs';
import _ from 'underscore';
import { BrowserWindow, dialog } from 'electron';
import response from '../../lib/response.es6';

module.exports = {
  $window(done, {title}) {
    let window = new BrowserWindow({
          width: 600,
          height: 400,
          title,
          resizable: false,
          minimizable: false,
          maximizable: false,
          fullscreen: false
        });

    return done(response(200));
  },

  '$window.dialog': function (done, options) {
    dialog.showOpenDialog(options, function (filepath = []) {
      return done(response(filepath.pop() || '', 200));
    });
  }
};
