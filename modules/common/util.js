module.exports = {

  isSameRace: function (raceA, raceB) {
    if (raceA && raceB && 
      (raceA.name.replace(/[^\w ]/, '').toLowerCase() === raceB.name.replace(/[^\w ]/, '').toLowerCase() &&
      raceA.date.replace(/[^\w ]/, '').toLowerCase() === raceB.date.replace(/[^\w ]/, '').toLowerCase()) &&
      raceA.track.replace(/[^\w ]/, '').toLowerCase() === raceB.track.replace(/[^\w ]/, '').toLowerCase()) {
      return true;
    }
    return false;
  },
  
};
