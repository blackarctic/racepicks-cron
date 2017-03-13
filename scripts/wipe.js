(function () {

  const config = require('./../config/config')({env: process.env});
  const db = require('./../modules/db')({config});
  const logger = require('./../modules/logger')({config});
  const common = require('./../modules/common');
  
  const axios = require('axios');
  const Nightmare = require('nightmare');

  function wipe (conn, key) {
    return new Promise((resolve, reject) => {
      try {
        if (key === undefined) { throw new Error("No key provided"); }
        db.remove(conn, key).then(resolve).catch(reject);
      }
      catch (e) { reject(e); }
    });
  }

  function main () {
    try {
      db.connect(config.server.firebase)
      .then(conn => {
        const argError = new Error("No valid argument provided. '/{path}' is expected.");
        if (process.argv.length < 3) { throw argError; }
        let key = process.argv[2].trim();
        if (key[0] !== '/') { throw argError; }
        wipe(conn, key)
        .then(() => { logger.exit.info(key + ' successfully wiped'); })
        .catch(e => { logger.exit.error(e); });
      })
      .catch(e => { logger.exit.error(e); });
    }
    catch (e) { logger.exit.error(e); }
  }

  main();

})();
