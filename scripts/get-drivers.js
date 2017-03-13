(function () {

  const config = require('./../config/config')({env: process.env});
  const db = require('./../modules/db')({config});
  const logger = require('./../modules/logger')({config});
  const common = require('./../modules/common');
  
  const axios = require('axios');
  const Nightmare = require('nightmare');

  function main () {
    try {
      db.connect(config.server.firebase)
      .then(conn => {

        common.db.getLatestRace({config, db, common, logger}, conn)
        .then(race => {

          const compareByNum = function compare(a, b) {
            if (Number(a.num) < Number(b.num)) { return -1; }
            if (Number(a.num) > Number(b.num)) { return 1; }
            return 0;
          };

          console.log('\n--- COUNT ---');
          console.log(race.drivers.all.length);
          
          console.log('\n--- ALL ---');
          race.drivers.all.sort(compareByNum).forEach(driver => {
            console.log(`${driver.name} (${driver.num})`);
          });

          console.log('\n--- ALL (NUMBERS) ---');
          race.drivers.all.sort(compareByNum).forEach(driver => {
            console.log(`${driver.num}`);
          });

          console.log('\n--- LIST A ---');
          race.drivers.lists.a.sort(compareByNum).forEach(driver => {
            console.log(`${driver.name} (${driver.num})`);
          });

          console.log('\n--- LIST B ---');
          race.drivers.lists.b.sort(compareByNum).forEach(driver => {
            console.log(`${driver.name} (${driver.num})`);
          });

          console.log('\n--- LIST C ---');
          race.drivers.lists.c.sort(compareByNum).forEach(driver => {
            console.log(`${driver.name} (${driver.num})`);
          });

          console.log();
          process.exit(0);
        })
        .catch(e => { logger.exit.error(e); });
      })
      .catch(e => { logger.exit.error(e); });
    }
    catch (e) { logger.exit.error(e); }
  }

  main();

})();
