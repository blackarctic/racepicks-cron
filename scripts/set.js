(function () {

  const config = require('./../config/config');
  const db = require('./../modules/db')({config});
  const logger = require('./../modules/logger')({config});
  const common = require('./../modules/common');
  
  const axios = require('axios');
  const Nightmare = require('nightmare');

  function main () {
    try {
      db.connect(config.server.firebase)
      .then(conn => {
        const typeArgError = new Error("No valid type argument provided. 'string', 'num', or 'bool' is expected.");
        const keyArgError = new Error("No valid key argument provided. '/{path}' is expected.");
        const keyValError = new Error("No valid value argument provided.");
        if (process.argv.length < 3) { throw typeArgError; }
        if (process.argv.length < 4) { throw keyArgError; }
        if (process.argv.length < 5) { throw keyValError; }
        let type = process.argv[2].trim().toLowerCase();
        if (type !== 'string' && type !== 'num' && type !== 'bool') { throw typeArgError; }
        let key = process.argv[3].trim();
        if (key[0] !== '/') { throw keyArgError; }
        let val = process.argv[4].trim();

        if (type === 'num') {
          val = Number(val);
        }
        if (type === 'bool') {
          if (val.toLowerCase() === 'true') { val = true; }
          else { val = false; }
        }

        db.set(conn, key, val)
        .then(() => { logger.exit.info(`${key} successfully set to ${val}`); })
        .catch(e => { logger.exit.error(e); });
      })
      .catch(e => { logger.exit.error(e); });
    }
    catch (e) { logger.exit.error(e); }
  }

  main();

})();
