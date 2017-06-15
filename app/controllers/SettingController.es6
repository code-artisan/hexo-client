import path from 'path';
import _ from 'underscore';
import fs from 'fs-jetpack';
import setting from '../../lib/setting.es6';
import response from '../../lib/response.es6';
import { ROOT_DIR } from '../config/global.es6';

const filepath = path.join(ROOT_DIR, 'Config', 'setting.json');

module.exports = {
  '$setting.get': function (done, {field}) {
    try {
      let config = fs.read(filepath, 'json'),
          result = config[ field ];

      if ( _.isArray(field) ) {
        result = {};

        _.each(field, function (item) {
          result[ item ] = config[ item ];
        });
      }

      return done(response(result));
    } catch (e) { }
  },

  '$setting.set': function (done, {setting}) {
    try {
      let config = fs.read(filepath, 'json');

      fs.write(filepath, {
        ...config,
        ...setting
      });

      return done(response(200));
    } catch (e) {
      console.log(e);
    }
  },

  '$setting.open': setting
};
