module.exports = (function () {

  const db = require('./db');

  this.isSameRace = function (raceA, raceB) {
    if (raceA && raceB && 
      (raceA.name.replace(/[^\w ]/, '').toLowerCase() === raceB.name.replace(/[^\w ]/, '').toLowerCase() &&
      raceA.date.replace(/[^\w ]/, '').toLowerCase() === raceB.date.replace(/[^\w ]/, '').toLowerCase()) &&
      raceA.track.replace(/[^\w ]/, '').toLowerCase() === raceB.track.replace(/[^\w ]/, '').toLowerCase()) {
      return true;
    }
    return false;
  };

  this.getLatestRace = function (conn) {
    return new Promise((resolve, reject) => {
      try {
        let key = `/races`;
        db.get(conn, key).then(snapshot => {
          let results = snapshot.val();
          if (results && results.length) {
            let raceId = Math.max(...Object.keys(results));
            resolve({id: raceId, val: results[raceId]});
          }
          else { resolve(null); }
        }).catch(reject);
      }
      catch (e) { reject(e); }
    });
  };

  return this;
})();
