module.exports = function (deps, conn, latestRace) {
  return new Promise((resolve, reject) => {
    try {
      const config = deps.config;
      const common = deps.common;
      const db = deps.db;
      const axios = deps.axios;
      const Nightmare = deps.Nightmare;

      // sanity checks
      if (!latestRace) { throw new Error('no race exists in the db. the race must be created first.'); }
      
      // get the url for the the live race json
      common.crawl.getLiveJsonUrl(deps, latestRace)
      .then(url => {
        // get the current lap data
        common.ajax.getLap(deps, url)
        .then(lap => {

          // sanity checks
          if (!lap) { throw new Error('no live race exists yet'); }
          
          // correctness checks
          let raceFromLap = {
            name: lap.run_name,
            date: latestRace.date,
            track: lap.track_name
          };
          if (!common.util.isSameRace(latestRace, raceFromLap)) {
            throw new Error('live race does not match the latest created race. no data saved.');
          }

          // save the url for the the live race json
          common.db.saveLiveJsonUrl(deps, conn, url, {race: latestRace})
          .then(() => {

            // save the current lap data
            let lapNum = lap.lap_number;
            common.db.saveLap(deps, conn, lap, {race: latestRace, lapNum})
            .then(() => resolve(lap))
            .catch(reject);

          })
          .catch(reject);
        })
        .catch(reject);
      })
      .catch(reject);
    }
    catch (e) { reject(e); }
  });
};
