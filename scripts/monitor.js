(function () {

  const path = 'scripts/monitor.js';

  const config = require('./../config/config.js');
  const axios = require('axios');
  const Nightmare = require('nightmare');
  const common = require('./../modules/common');
  const db = require('./../modules/db');
  const logger = require('./../modules/logger');

  function saveLap (conn, data, metadata) {
    return new Promise((resolve, reject) => {
      try {
        let raceId = metadata.raceId;
        let lapNum = metadata.lapNum;
        if (!raceId) { throw 'No valid race ID provided'; }
        let key = `/races/${raceId}/live`;
        db.set(conn, key, data)
        .then(() => {
          if (lapNum !== undefined && lapNum !== null && Number(lapNum) !== NaN) {
            let key = `/races/${raceId}/laps/${Number(lapNum)}`;
            db.set(conn, key, data).then(resolve).catch(reject);
          }
        })
        .catch(reject);
      }
      catch (e) { reject(e); }
    });
  }

  function getLap (url) {
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
        .then(response => {
          try {
            resolve(response.data);
          }
          catch (e) { reject(e); }
        })
        .catch(reject);
      }
      catch (e) { reject(e); }
    });
  }

  function getUrl () {
    return new Promise((resolve, reject) => {
      try {
        Nightmare({show: false})
        .goto('http://www.nascar.com/racecenter.html')
        .evaluate(() => { return liveRaceURL; })
        .end()
        .then(resolve)
        .catch(reject);
      }
      catch (e) { reject(e); }
    });
  }

  function main () {
    try {
      db.connect(config.firebase)
      .then(conn => {
        getUrl()
        .then(url => {
          common.getLatestRace(conn)
          .then((latestRace) => {
            logger.info('cycle has begun', {path, url, latestRace});
            const runCycle = function () {
              getLap(url)
              .then(data => {
                if (!data) { throw 'no live race exists yet'; }
                if (!latestRace) { throw 'no race exists in the db. the race must be created first.'; }
                let race = {
                  name: data.run_name,
                  date: latestRace.val.date,
                  track: data.track_name
                };
                if (!common.isSameRace(latestRace.val, race)) { throw 'live race does not match the latest created race. no data saved.'; }

                let raceId = latestRace.id;
                let lapNum = data.lap_number;
                return saveLap(conn, data, {raceId, lapNum});
              })
              .then(() => { setTimeout(() => { runCycle(); }, 1000); })
              .catch(e => { logger.error('cycle failed: ' + e, {path, url, latestRace}, () => { setTimeout(() => { runCycle(); }, 1000 * 60 * 5); }); });
            }; runCycle();
          })
          .catch(e => { logger.error('getLatestRace error: ' + e, {path}, () => { process.exit(1); }); });
        })
        .catch(e => { logger.error('getUrl error: ' + e, {path}, () => { process.exit(1); }); });
      })
      .catch(e => { logger.error('db connect error: ' + e, {path}, () => { process.exit(1); }); });
    }
    catch (e) { logger.error('error occurred: ' + e, {path}, () => { process.exit(1); }); }
  }

  main();

})();
