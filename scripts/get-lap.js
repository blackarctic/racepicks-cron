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

        const lapNumArgError = new Error("No valid lap number argument provided");
        if (process.argv.length < 3) { throw lapNumArgError; }
        let lapNum = process.argv[2].trim().toLowerCase();

        common.db.getLatestRace({config, db, common, logger}, conn, {lap: true, lapNum})
        .then(race => {

          if (!race) { throw new Error(`race with lap ${lapNum} could not be found`); }

          const compareByPos = function (a, b) {
            return Number(a.running_position - b.running_position);
          }

          const compareByCarNum = function (a, b) {
            return Number(a.vehicle_number - b.vehicle_number);
          }

          if (race.laps && race.laps[lapNum]) {
            let vehicles = race.laps[lapNum].vehicles.sort(compareByPos);
            
            console.log('\n--- DRIVERS ---');
            race.laps[lapNum].vehicles.sort(compareByPos).forEach(vehicle => {
              console.log(`${vehicle.driver.full_name} (${vehicle.vehicle_number})`);
            });

            console.log('\n--- NUMBERS ---');
            race.laps[lapNum].vehicles.sort(compareByPos).forEach(vehicle => {
              console.log(`${vehicle.vehicle_number}`);
            });

            console.log('\n--- POSITIONS BY NUMBER ---');
            race.laps[lapNum].vehicles.sort(compareByCarNum).forEach(vehicle => {
              console.log(`${vehicle.running_position}`);
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
