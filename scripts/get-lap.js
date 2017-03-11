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

        common.db.getLatestRace({config, db, common, logger}, conn)
        .then(race => {

          const lapNumArgError = new Error("No valid lap number argument provided");
          if (process.argv.length < 3) { throw lapNumArgError; }
          let lapNum = process.argv[2].trim().toLowerCase();

          if (race.laps && race.laps[lapNum]) {
            console.log('\n--- ALL ---');
            race.vehicles.forEach(vehicle => {
              console.log(`${vehicle.driver.full_name} (${vehicle.vehicle_number})`);
            });

            console.log('\n--- ALL (NUMBERS) ---');
            race.vehicles.forEach(vehicle => {
              console.log(`${vehicle.vehicle_number}`);
            });

            console.log();
            process.exit(0);
          }
          else {
            throw new Error(`lap ${lapNum} could not be found`);
          }
        })
        .catch(e => { logger.exit.error(e); });
      })
      .catch(e => { logger.exit.error(e); });
    }
    catch (e) { logger.exit.error(e); }
  }

  main();

})();
