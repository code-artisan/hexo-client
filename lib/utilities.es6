import path from 'path';
import fs from 'fs-jetpack';
import { ROOT_DIR } from '../app/config/global.es6';

function getConfig() {
  let filepath = path.join(ROOT_DIR, 'Config', 'setting.json');

  return fs.exists(filepath) === 'file' ? fs.read(filepath, 'json') : {};
}

function getPrefix() {
  return getConfig().prefix || '';
}

module.exports = {
  getConfig,
  getPrefix
};
