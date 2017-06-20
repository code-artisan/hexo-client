import path from 'path';
import { app } from 'electron';

const ROOT_DIR = app.getPath('userData');

const ASSETS_PATH = path.join(__dirname, 'public', 'assets');

module.exports = {
  ROOT_DIR, ASSETS_PATH
};
