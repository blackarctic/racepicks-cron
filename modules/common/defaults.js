module.exports = {

  race: function () {
    return {
      details: {
        id: '',
        name: '',
        date: '',
        dateParts: {},
        track: '',
        liveJSONUrl: '',
        segments: {
          first: 0,
          second: 0,
        },
        timestamps: {
          created: null,
          start: null,
          started: null,
          finished: null,
        },
        tossups: {
          high: {
            prompt: 'None',
            answer: 'None'
          },
          max: {
            prompt: 'None',
            answer: 'None'
          },
          extreme: {
            prompt: 'None',
            answer: 'None'
          },
        },
        wagers: {
          first: ['None', 'None'],
          second: ['None', 'None'],
          third: ['None', 'None'],
        }
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
      entries: {},
    };
  },
  
};
