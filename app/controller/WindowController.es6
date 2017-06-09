import fs from 'fs';
import _ from 'underscore';
import { BrowserWindow } from 'electron';
import response from '../response.es6';

module.exports = {
  window(done, {title}) {
    let window = new BrowserWindow({
          width: 600,
          height: 400,
          title,
          resizable: false,
          minimizable: false,
          maximizable: false
        });

    window.loadUrl('https://www.baidu.com');

    return done(response(200));
  }
};
