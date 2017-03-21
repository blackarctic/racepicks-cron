module.exports = {

  isSameRace: function (raceA, raceB) {
    if (raceA && raceB &&
      raceA.details && raceB.details && 
      raceA.details.name && raceB.details.name &&
      raceA.details.date && raceB.details.date &&
      raceA.details.track && raceB.details.track &&
      (raceA.details.name.replace(/[^\w ]/, '').split(' ')[0].toLowerCase() === raceB.details.name.replace(/[^\w ]/, '').split(' ')[0].toLowerCase() &&
      raceA.details.date.replace(/[^\w ]/, '').toLowerCase() === raceB.details.date.replace(/[^\w ]/, '').toLowerCase()) &&
      raceA.details.track.replace(/[^\w ]/, '').split(' ')[0].toLowerCase() === raceB.details.track.replace(/[^\w ]/, '').split(' ')[0].toLowerCase()) {
      return true;
    }
    return false;
  },
  
};
