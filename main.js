(function () {

  const config = require('./config/config');
  const db = require('./modules/db')({config});
  const logger = require('./modules/logger')({config});
  const common = require('./modules/common');

  const axios = require('axios');
  const Nightmare = require('nightmare');

  const deps = {config, db, logger, common, axios, Nightmare};

  const createRace = require('./modules/action/create.js');
  const monitorRace = require('./modules/action/monitor.js');

  try {

    const ONE_SECOND = 1000;
    const ONE_MINUTE = 1000 * 60;
    const FIVE_MINUTES = 1000 * 60 * 5;
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const THREE_DAYS = 1000 * 60 * 60 * 48;

    function main (conn) {

      // get latest race from db
      common.db.getLatestRace(deps, conn)
      .then(latestRace => {

        logger.debug('got latest race', latestRace);

        // if there is no race
        if (!latestRace) {
          // create the race
          let prevRace = latestRace;
          createRace(deps, conn, prevRace)
          .then(data => { logger.info('race successfully created', data); cycle(conn, ONE_MINUTE); })
          .catch(e => { logger.error(e); cycle(conn, ONE_DAY); });
        }

        // otherwise, if the latest race is finished
        else if (latestRace.timestamps.finished || (latestRace.live && latestRace.live.laps_to_go === 0 && latestRace.live.flag_state === 9)) {
          
          // if the latest race is marked as finished
          if (latestRace.timestamps.finished) {
            // create the race
            let prevRace = latestRace;
            createRace(deps, conn, prevRace)
            .then(data => { logger.info('race successfully created', data); cycle(conn, ONE_MINUTE); })
            .catch(e => { logger.error(e); cycle(conn, ONE_DAY); });
          }
          
          // if the latest race is not marked as finished
          else {
            // mark the race as finished
            common.db.markRaceAsFinished(deps, conn, {race: latestRace})
            .then(data => {
              if (!data.alreadyExists) { logger.info('race marked as finished', data); }
              cycle(conn, THREE_DAYS);
            })
            .catch(e => { logger.error(e); cycle(conn, TWENTY_FOUR_HOURS); });
          }
        }

        // otherwise, if the race is started 
        else if (latestRace.timestamps.started || (latestRace.timestamps.start && Date.now() > latestRace.timestamps.start)) {
          // if not marked, mark the race as started
          common.db.markRaceAsStarted(deps, conn, {race: latestRace})
          .then(data => {
            if (!data.alreadyExists) { logger.info('race marked as started', data); }
            // monitor the race
            monitorRace(deps, conn, latestRace)
            .then(data => { logger.info('begun monitoring race', data); cycle(conn, ONE_SECOND); })
            .catch(e => { logger.error(e); cycle(conn, FIVE_MINUTES); });
          })
          .catch(e => { logger.error(e); cycle(conn, FIVE_MINUTES); });
        }
        else {
          cycle(conn, ONE_MINUTE);
        }
        
      })
      .catch(e => { logger.exit.error(e); });
    }

    function cycle (conn, delay) {
      logger.debug(`setting next cycle for ${delay/1000} s`);
      setTimeout(() => { logger.debug(`running cycle after ${delay/1000} s`); main(conn); }, delay);
    }

    db.connect(config.server.firebase)
    .then(conn => { logger.debug('connected to firebase db'); cycle(conn, 0); })
    .catch(e => { logger.exit.error(e); });

  } catch (e) { logger.exit.error(e); }

})();
