import uuidV4 from 'uuid/v4';
import { ipcRenderer } from 'electron';

function execute(payload) {
  const channel = `$${ payload.$type }`,
        uuid = uuidV4();

  let deferred = {};

  deferred.promise = new Promise(function (resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject  = reject;
  })

  ipcRenderer.send(channel, payload, uuid);

  ipcRenderer.once(`${channel}-${uuid}`, function (event, result) {
    return deferred.resolve(result);
  });

  return deferred.promise;
}

export default execute;
