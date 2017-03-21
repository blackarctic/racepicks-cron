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

          console.log('\nSetting Details\n');

          prompt.start();
          prompt.get([

            // segment laps
            {
              name: 'seg_1_lap',
              description: 'Lap - Segment 1',
              type: 'integer',
              default: '',
              required: true,
            },
            {
              name: 'seg_2_lap',
              description: 'Lap - Segment 2',
              type: 'integer',
              default: '',
              required: true,
              before: val => { console.log('\n'); return val; }
            },

            // wagers
            {
              name: 'wager_seg_1_1',
              description: 'Wager - Driver - Segment 1',
              type: 'integer',
              default: '',
              required: true,
              before: val => { return String(val); }
            },
            {
              name: 'wager_seg_1_2',
              description: 'Wager - Driver - Segment 1',
              type: 'integer',
              default: '',
              required: true,
              before: val => { console.log(); return String(val); }
            },
            {
              name: 'wager_seg_2_1',
              description: 'Wager - Driver - Segment 2',
              type: 'integer',
              default: '',
              required: true,
              before: val => { return String(val); }
            },
            {
              name: 'wager_seg_2_2',
              description: 'Wager - Driver - Segment 2',
              type: 'integer',
              default: '',
              required: true,
              before: val => { console.log(); return String(val); }
            },
            {
              name: 'wager_seg_3_1',
              description: 'Wager - Driver - Segment 3',
              type: 'integer',
              default: '',
              required: true,
              before: val => { return String(val); }
            },
            {
              name: 'wager_seg_3_2',
              description: 'Wager - Driver - Segment 3',
              type: 'integer',
              default: '',
              required: true,
              before: val => { console.log('\n'); return String(val); }
            },

            // tossups
            {
              name: 'tossup_high_prompt',
              description: 'Tossup - Prompt - High',
              type: 'string',
              default: '',
              required: true,
            },
            {
              name: 'tossup_high',
              description: 'Tossup - Default Answer - High',
              type: 'string',
              default: '',
              required: false,
              before: val => { console.log(); return val; }
            },
            {
              name: 'tossup_max_prompt',
              description: 'Tossup - Prompt - Max',
              type: 'string',
              default: '',
              required: true,
            },
            {
              name: 'tossup_max',
              description: 'Tossup - Default Answer - Max',
              type: 'string',
              default: '',
              required: false,
              before: val => { console.log(); return val; }
            },
            {
              name: 'tossup_extreme_prompt',
              description: 'Tossup - Prompt - Extreme',
              type: 'string',
              default: '',
              required: true,
            },
            {
              name: 'tossup_extreme',
              description: 'Tossup - Default Answer - Extreme',
              type: 'string',
              default: '',
              required: false,
              before: val => { console.log('\n'); return val; }
            },

          ], function (err, result) {
            if (err) { console.log('\ncancelled'); process.exit(0); }

            let updates = {};
            updates[`/races/${raceId}/details/segments/first`] = result.seg_1_lap;
            updates[`/races/${raceId}/details/segments/second`] = result.seg_2_lap;
            updates[`/races/${raceId}/details/wagers/first/0`] = result.wager_seg_1_1;
            updates[`/races/${raceId}/details/wagers/first/1`] = result.wager_seg_1_2;
            updates[`/races/${raceId}/details/wagers/second/0`] = result.wager_seg_2_1;
            updates[`/races/${raceId}/details/wagers/second/1`] = result.wager_seg_2_2;
            updates[`/races/${raceId}/details/wagers/third/0`] = result.wager_seg_3_1;
            updates[`/races/${raceId}/details/wagers/third/1`] = result.wager_seg_3_2;
            updates[`/races/${raceId}/details/tossups/high/prompt`] = result.tossup_high_prompt;
            updates[`/races/${raceId}/details/tossups/high/answer`] = result.tossup_high;
            updates[`/races/${raceId}/details/tossups/max/prompt`] = result.tossup_max_prompt;
            updates[`/races/${raceId}/details/tossups/max/answer`] = result.tossup_max;
            updates[`/races/${raceId}/details/tossups/extreme/prompt`] = result.tossup_extreme_prompt;
            updates[`/races/${raceId}/details/tossups/extreme/answer`] = result.tossup_extreme;

            db.update(conn, updates)
            .then(() => { logger.exit.info(`race details successfully set`); })
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
