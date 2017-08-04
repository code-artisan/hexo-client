import fs from 'fs';
import path from 'path';

import logger from 'electron-log';
import {
  LOG_DIR,
  ROOT_DIR,
  SERVER_LOG_FILE_NAME,
  CLIENT_LOG_FILE_NAME
} from '../app/config/global.es6';

const SERVER_LOG_FILE_PATH = path.join(LOG_DIR, SERVER_LOG_FILE_NAME);

const streamConfig = {
  flags: 'a'
};

// 创建应用目录
if (! fs.existsSync(ROOT_DIR)) fs.mkdirSync(ROOT_DIR);

// 创建日志目录
if (! fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

// Same as for console transport
logger.transports.file.level = 'info';
logger.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s}.{ms} [{level}] {text}';

// Write to this file, must be set before first logging
logger.transports.file.file = SERVER_LOG_FILE_PATH;

// set existed file stream
logger.transports.file.stream = fs.createWriteStream(SERVER_LOG_FILE_PATH, streamConfig);

export default logger;
