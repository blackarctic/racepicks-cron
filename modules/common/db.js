module.exports = {

  getLatestRace: function (deps, conn) {
    return new Promise((resolve, reject) => {
      try {
        const db = deps.db;
        let key = `/races`;
        db.get(conn, key).then(snapshot => {
          let results = snapshot.val();
          if (results && results.length) {
            let raceId = Math.max(...Object.keys(results));
            resolve(results[raceId]);
          }
          else { resolve(null); }
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

};
