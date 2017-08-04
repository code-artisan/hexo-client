import path from 'path';
import { app } from 'electron';

const ROOT_DIR = app.getPath('userData');

const ASSETS_PATH = path.join(__dirname, 'public', 'assets');

const LOG_DIR = path.join(ROOT_DIR, 'Logs');

const SERVER_LOG_FILE_NAME = 'server.log';
const CLIENT_LOG_FILE_NAME = 'client.log';

module.exports = {
  ROOT_DIR,
  LOG_DIR,
  ASSETS_PATH,
  SERVER_LOG_FILE_NAME,
  CLIENT_LOG_FILE_NAME
};
