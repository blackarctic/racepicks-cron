module.exports = {

  race: function () {
    return {
      id: '',
      name: '',
      date: '',
      track: '',
      timestamps: {
        created: null,
        start: null,
        started: null,
        finished: null,
      },
      drivers: {
        all: [],
        lists: {
          a: [],
          b: [],
          c: [],
        },
      },
      laps: {},
      live: {},
    };
  },
  
};
