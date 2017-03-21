module.exports = {

  getLatestRaceId: function (deps, conn) {
    return new Promise((resolve, reject) => {
      try {
        const db = deps.db;
        let key = `/latestRaceId`;
        db.get(conn, key).then(snapshot => {
          if (!snapshot || !snapshot.val()) { return resolve(null); }
          resolve(snapshot.val());
        }).catch(reject);
      }
      catch (e) { reject(e); }
    });
  },

  getLatestRace: function (deps, conn, metadata) {
    return new Promise((resolve, reject) => {
      try {
        const db = deps.db;
        
        let getDetails = metadata.details || false;
        let getLive = metadata.live || false;
        let getDrivers = metadata.drivers || false;
        let getLap = metadata.lap || false;
        let lapNum = getLap ? Number(metadata.lapNum) : 0;
        
        let race = {};

        let promises = [null, null, null, null];
        if (getDetails) { promises[0] = this.getLatestRaceDetails(deps, conn); }
        if (getLive) { promises[1] = this.getLatestRaceLive(deps, conn); }
        if (getDrivers) { promises[2] = this.getLatestRaceDrivers(deps, conn); }
        if (getLap) { promises[3] = this.getLatestRaceLap(deps, conn, {lapNum}); }
        
        Promise.all(promises).then(values => {
          
          let raceDetails = values[0];
          let raceLive = values[1];
          let raceDrivers = values[2];
          let raceLap = values[3];

          if (raceDetails) { race.details = raceDetails; }
          if (raceLive) { race.live = raceLive; }
          if (raceDrivers) { race.drivers = raceDrivers; }
          if (raceLap) { race.laps[lapNum] = raceLap; }

          resolve(race);

        }).catch(reject);
      }
      catch (e) { reject(e); }
    });
  },

  getLatestRaceDetails: function (deps, conn) {
    return new Promise((resolve, reject) => {
      try {
        const db = deps.db;
        this.getLatestRaceId(deps, conn).then(latestRaceId => {
          if (!latestRaceId) { return resolve(null); }
          db.get(conn, `/races/${latestRaceId}/details`).then(snapshot => {
            let details = snapshot.val();
            if (!details) { resolve(null); }
            resolve(details);
          }).catch(reject);
        }).catch(reject);
      }
      catch (e) { reject(e); }
    });
  },

  getLatestRaceLive: function (deps, conn) {
    return new Promise((resolve, reject) => {
      try {
        const db = deps.db;
        this.getLatestRaceId(deps, conn).then(latestRaceId => {
          if (!latestRaceId) { return resolve(null); }
          db.get(conn, `/races/${latestRaceId}/live`).then(snapshot => {
            let live = snapshot.val();
            if (!live) { resolve(null); }
            resolve(live);
          }).catch(reject);
        }).catch(reject);
      }
      catch (e) { reject(e); }
    });
  },

  getLatestRaceDrivers: function (deps, conn) {
    return new Promise((resolve, reject) => {
      try {
        const db = deps.db;
        this.getLatestRaceId(deps, conn).then(latestRaceId => {
          if (!latestRaceId) { return resolve(null); }
          db.get(conn, `/races/${latestRaceId}/drivers`).then(snapshot => {
            let drivers = snapshot.val();
            if (!drivers) { resolve(null); }
            resolve(drivers);
          }).catch(reject);
        }).catch(reject);
      }
      catch (e) { reject(e); }
    });
  },

  getLatestRaceLap: function (deps, conn, metadata) {
    return new Promise((resolve, reject) => {
      try {
        const db = deps.db;
        let lapNum = metadata.lapNum;
        this.getLatestRaceId(deps, conn).then(latestRaceId => {
          if (!latestRaceId) { return resolve(null); }
          db.get(conn, `/races/${latestRaceId}/laps/${lapNum}`).then(snapshot => {
            let lap = snapshot.val();
            if (!lap) { resolve(null); }
            resolve(lap);
          }).catch(reject);
        }).catch(reject);
      }
      catch (e) { reject(e); }
    });
  },

  saveRaceInfo: function (deps, conn, data) {
    return new Promise((resolve, reject) => {
      try {
        const db = deps.db;
        let raceId = data.id;
        if (!raceId) { throw new Error('No valid race ID provided'); }
        let key = `/latestRaceId`;
        db.set(conn, key, raceId).then(() => {
          let key = `/races/${raceId}`;
          db.set(conn, key, data).then(resolve).catch(reject);          
        }).catch(reject);
      }
      catch (e) { reject(e); }
    });
  },

  saveLap: function (deps, conn, data, metadata) {
    return new Promise((resolve, reject) => {
      try {
        const db = deps.db;
        let raceId = metadata.race.details.id;
        let lapNum = metadata.lapNum;
        if (!raceId) { throw new Error('No valid race ID provided'); }
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
  },

  saveLiveJsonUrl: function (deps, conn, data, metadata) {
    return new Promise((resolve, reject) => {
      try {
        let existingLiveJsonUrl = metadata.race.details.liveJsonUrl;
        if (existingLiveJsonUrl) { resolve({alreadyExists: true}); }
        else {
          const db = deps.db;
          let raceId = metadata.race.details.id;
          if (!raceId) { throw new Error('No valid race ID provided'); }
          let key = `/races/${raceId}/details/liveJsonUrl`;
          db.set(conn, key, data).then(() => { resolve({}); }).catch(reject);
        }
      }
      catch (e) { reject(e); }
    });
  },

  markRaceAsStarted: function (deps, conn, metadata) {
    return new Promise((resolve, reject) => {
      try {
        let existingStartedTimestamp = metadata.race.details.timestamps.started;
        if (existingStartedTimestamp) { resolve({alreadyExists: true}); }
        else {
          const db = deps.db;
          let raceId = metadata.race.details.id;
          if (!raceId) { throw new Error('No valid race ID provided'); }
          let key = `/races/${raceId}/details/timestamps/started`;
          db.set(conn, key, Date.now()).then(() => { resolve({}); }).catch(reject);          
        }
      }
      catch (e) { reject(e); }
    });
  },

  markRaceAsFinished: function (deps, conn, metadata) {
    return new Promise((resolve, reject) => {
      try {
        let existingFinishedTimestamp = metadata.race.details.timestamps.finished;
        if (existingFinishedTimestamp) { resolve({alreadyExists: true}); }
        else {
          const db = deps.db;
          let raceId = metadata.race.details.id;
          if (!raceId) { throw new Error('No valid race ID provided'); }
          let key = `/races/${raceId}/details/timestamps/finished`;
          db.set(conn, key, Date.now()).then(() => { resolve({}); }).catch(reject);
        }
      }
      catch (e) { reject(e); }
    });
  },

};
