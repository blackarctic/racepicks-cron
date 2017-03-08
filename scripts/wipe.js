(function () {

  const path = 'scripts/wipe.js';

  const config = require('./../config/config.js');
  const nightmare = require('nightmare')({ show: false });
  const common = require('./../modules/common');
  const db = require('./../modules/db');
  const logger = require('./../modules/logger');

  function wipe (conn, key) {
    return new Promise((resolve, reject) => {
      try {
        if (key === undefined) { throw "No key provided"; }
        db.remove(conn, key).then(resolve).catch(reject);
      }
      catch (e) { reject(e); }
    });
  }

  function main () {
    try {
      db.connect(config.firebase)
      .then(conn => {
        const argError = "No valid argument provided. '/{path}' is expected.";
        if (process.argv.length < 3) { throw argError; }
        let key = process.argv[2].trim();
        if (key[0] !== '/') { throw argError; }
        wipe(conn, key)
        .then(() => { logger.info(key + ' successfully wiped', {path}, () => { process.exit(0); }); })
        .catch(e => { logger.error('wipe error: ' + e, {path}, () => { process.exit(1); }); });
      })
      .catch(e => { logger.error('db connect error: ' + e, {path}, () => { process.exit(1); }); });
    }
    catch (e) { logger.error('error occurred: ' + e, {path}, () => { process.exit(1); }); }
  }

  main();

})();
