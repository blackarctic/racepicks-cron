module.exports = function (deps, conn, prevRace) {
  return new Promise((resolve, reject) => {
    try {
      const config = deps.config;
      const common = deps.common;
      const db = deps.db;
      const Nightmare = deps.Nightmare;
      
      common.crawl.getRaceInfo(deps)
      .then(race => {
        
        // get race id if this is a new race
        let raceId;
        if (!prevRace) { raceId = 1; }
        else if (!common.util.isSameRace(prevRace, race)) { raceId = prevRace.id + 1; }
        else { throw new Error(`race not created. race already exists (${race.name} @ ${race.track})`); }

        // only grab the drivers who have numbers
        race.drivers.all = race.drivers.all.filter(function (driver) { return driver.num !== ''; });
        race.drivers.lists.a = race.drivers.lists.a.filter(function (driver) { return driver.num !== ''; });
        race.drivers.lists.b = race.drivers.lists.b.filter(function (driver) { return driver.num !== ''; });
        race.drivers.lists.c = race.drivers.lists.c.filter(function (driver) { return driver.num !== ''; });

        // set the race id
        race.id = raceId;

        // save the race in db
        common.db.saveRaceInfo(deps, conn, race)
        .then(() => { resolve(race); })
        .catch(reject);
      })
      .catch(reject);
    }
    catch (e) { reject(e); }
  });
};
