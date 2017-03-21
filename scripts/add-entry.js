(function () {

  const config = require('./../config/config')({env: process.env});
  const db = require('./../modules/db')({config});
  const logger = require('./../modules/logger')({config});
  const common = require('./../modules/common');

  const prompt = require('prompt');

  function main () {
    try {
      db.connect(config.server.firebase)
      .then(conn => {
        common.db.getLatestRaceId({config, db, common, logger}, conn)
        .then(raceId => {

          if (!raceId) { throw new Error('race id could not be found'); }

          console.log('\nAdding Entry\n');

          prompt.start();
          prompt.get([

            // profile info
            {
              name: 'username',
              description: 'Username',
              type: 'string',
              default: '',
              required: true,
            },
            {
              name: 'icon',
              description: 'Icon',
              type: 'string',
              default: 'user',
              required: false,
              before: val => { console.log('\n'); return val; }
            },

            // picks
            {
              name: 'pick_a_1',
              description: 'Pick - A List',
              type: 'integer',
              default: '',
              required: false,
              before: val => { return String(val); }
            },
            {
              name: 'pick_a_2',
              description: 'Pick - A List',
              type: 'integer',
              default: '',
              required: false,
              before: val => { console.log(); return String(val); }
            },
            {
              name: 'pick_b_1',
              description: 'Pick - B List',
              type: 'integer',
              default: '',
              required: false,
              before: val => { return String(val); }
            },
            {
              name: 'pick_b_2',
              description: 'Pick - B List',
              type: 'integer',
              default: '',
              required: false,
              before: val => { console.log(); return String(val); }
            },
            {
              name: 'pick_c',
              description: 'Pick - C List',
              type: 'integer',
              default: '',
              required: false,
              before: val => { console.log('\n'); return String(val); }
            },

            // wagers
            {
              name: 'wager_seg_1_pick',
              description: 'Wager - Seg 1 Pick',
              type: 'integer',
              default: '',
              required: false,
              before: val => { return String(val); }
            },
            {
              name: 'wager_seg_1_bet',
              description: 'Wager - Seg 1 Bet',
              type: 'integer',
              default: 0,
              required: false,
              before: val => { console.log(); return val; }
            },
            {
              name: 'wager_seg_2_pick',
              description: 'Wager - Seg 2 Pick',
              type: 'integer',
              default: '',
              required: false,
              before: val => { return String(val); }
            },
            {
              name: 'wager_seg_2_bet',
              description: 'Wager - Seg 2 Bet',
              type: 'integer',
              default: 0,
              required: false,
              before: val => { console.log(); return val; }
            },
            {
              name: 'wager_seg_3_pick',
              description: 'Wager - Seg 3 Pick',
              type: 'integer',
              default: '',
              required: false,
              before: val => { return String(val); }
            },
            {
              name: 'wager_seg_3_bet',
              description: 'Wager - Seg 3 Bet',
              type: 'integer',
              default: 0,
              required: false,
              before: val => { console.log('\n'); return val; }
            },

            // tossups
            {
              name: 'tossup_high',
              description: 'Tossup - High',
              type: 'string',
              default: '',
              required: false,
            },
            {
              name: 'tossup_max',
              description: 'Tossup - Max',
              type: 'string',
              default: '',
              required: false,
            },
            {
              name: 'tossup_extreme',
              description: 'Tossup - Extreme',
              type: 'string',
              default: '',
              required: false,
              before: val => { console.log('\n'); return val; }
            },
          ], function (err, result) {
            if (err) { console.log('\ncancelled'); process.exit(0); }
            let key = `/races/${raceId}/entries/${result.username}`;
            db.set(conn, key, result)
            .then(() => { logger.exit.info(`${key} successfully set`); })
            .catch(e => { logger.exit.error(e); });
          });

        })
        .catch(e => { logger.exit.error(e); });
      })
      .catch(e => { logger.exit.error(e); });
    }
    catch (e) { logger.exit.error(e); }
  }

  main();

})();
