module.exports = {

  getLatestRace: function (deps, conn) {
    return new Promise((resolve, reject) => {
      try {
        const db = deps.db;
        let key = `/races`;
        db.getAndOrderByChildAndLimitToLast(conn, key, 'id', 1).then(snapshot => {
          snapshot.forEach(function (childSnapshot) {
            let race = childSnapshot.val();
            if (race) { resolve(race); }
            else { resolve(null); }
          });
          resolve(null);
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
        let key = `/races/${raceId}`;
        db.set(conn, key, data).then(resolve).catch(reject);
      }
      catch (e) { reject(e); }
    });
  },

  saveLap: function (deps, conn, data, metadata) {
    return new Promise((resolve, reject) => {
      try {
        const db = deps.db;
        let raceId = metadata.race.id;
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
        let existingLiveJsonUrl = metadata.race.liveJsonUrl;
        if (existingLiveJsonUrl) { resolve({alreadyExists: true}); }
        else {
          const db = deps.db;
          let raceId = metadata.race.id;
          if (!raceId) { throw new Error('No valid race ID provided'); }
          let key = `/races/${raceId}/liveJsonUrl`;
          db.set(conn, key, data).then(() => { resolve({}); }).catch(reject);
        }
      }
      catch (e) { reject(e); }
    });
  },

  markRaceAsStarted: function (deps, conn, metadata) {
    return new Promise((resolve, reject) => {
      try {
        let existingStartedTimestamp = metadata.race.timestamps.started;
        if (existingStartedTimestamp) { resolve({alreadyExists: true}); }
        else {
          const db = deps.db;
          let raceId = metadata.race.id;
          if (!raceId) { throw new Error('No valid race ID provided'); }
          let key = `/races/${raceId}/timestamps/started`;
          db.set(conn, key, Date.now()).then(() => { resolve({}); }).catch(reject);          
        }
      }
      catch (e) { reject(e); }
    });
  },

  markRaceAsFinished: function (deps, conn, metadata) {
    return new Promise((resolve, reject) => {
      try {
        let existingFinishedTimestamp = metadata.race.timestamps.finished;
        if (existingFinishedTimestamp) { resolve({alreadyExists: true}); }
        else {
          const db = deps.db;
          let raceId = metadata.race.id;
          if (!raceId) { throw new Error('No valid race ID provided'); }
          let key = `/races/${raceId}/timestamps/finished`;
          db.set(conn, key, Date.now()).then(() => { resolve({}); }).catch(reject);
        }
      }
      catch (e) { reject(e); }
    });
  },

};
