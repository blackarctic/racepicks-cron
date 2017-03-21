module.exports = {

  getLiveJsonUrl: function (deps, race) {
    return new Promise((resolve, reject) => {
      try {
        if (race && race.details && race.details.liveJsonUrl) {
          resolve(race.details.liveJsonUrl);
        }
        else {
          const config = deps.config;
          const Nightmare = deps.Nightmare;
          Nightmare({show: false})
          .goto(config.endpoints.nascar.racecenter)
          .evaluate(() => { return liveRaceURL; })
          .end()
          .then(resolve)
          .catch(reject);
        }
      }
      catch (e) { reject(e); }
    });
  },

  getRaceInfo: function (deps) {
    return new Promise((resolve, reject) => {
      try {
        const config = deps.config;
        const common = deps.common;
        const Nightmare = deps.Nightmare;

        let race = common.defaults.race();

        Nightmare({show: true})
        .goto(config.endpoints.yahoo.playerdistribution)
        .inject('js', './node_modules/jquery/dist/jquery.min.js')
        .evaluate((race) => {

          // get event info
          var eventInfo = $('#event-info');
          race.details.name = eventInfo.find('h3').html().split('<em>')[0].trim();
          race.details.date = eventInfo.find('h3 em').text().trim();
          race.details.track = $('#event-details #venue p:nth-of-type(2)').text().trim();

          // get drivers
          var aListTable = $('.data-table:nth-of-type(1)');
          var bListTable = $('.data-table:nth-of-type(2)');
          var cListTable = $('.data-table:nth-of-type(3)');

          var pushEach = function (index, elem, list) {
            var driver = {
              name: $(elem).text(),
              num: '',
              link: $(elem).attr('href')
            };
            race.drivers.all.push(driver);
            race.drivers.lists[list].push(driver);
          };

          aListTable.find('.player a').each(function (index, elem) { pushEach(index, elem, 'a'); });
          bListTable.find('.player a').each(function (index, elem) { pushEach(index, elem, 'b'); });
          cListTable.find('.player a').each(function (index, elem) { pushEach(index, elem, 'c'); });

          return race;
        }, race)
        .end()
        .then(race => {

          Nightmare({show: false})
          .goto(config.endpoints.nascar.racecenter)
          .inject('js', './node_modules/jquery/dist/jquery.min.js')
          .evaluate((race) => {

            // check that nascar.com and yahoo.com are both on the same race
            var track = $('#nascar-live .race-details .race-name').text();
            if (race.details.track.split(' ')[0] !== track.split(' ')[0]) { 
              return null;
            }

            // get date & time of race
            race.details.dateParts = $('#nascar-live .race-date').text().trim().split(/[ :]/)
              .map(x => x.replace(/[^\w\d]/, '')).filter(x => x !== '');

            // get car numbers
            $('.entryListDataTable .table-row').each(function (index, elem) {
              var cleanup = function (html) { return html ? html.replace('<br>', ' ').replace(/[^\w ]/, '').toLowerCase() : ''; }
              var name = cleanup($(elem).find('.driver').html());
              var num = cleanup($(elem).find('.car-number').html());
              race.drivers.all.forEach(function (driver) { if (cleanup(driver.name) === name) { driver.num = num; } });
              race.drivers.lists.a.forEach(function (driver) { if (cleanup(driver.name) === name) { driver.num = num; } });
              race.drivers.lists.b.forEach(function (driver) { if (cleanup(driver.name) === name) { driver.num = num; } });
              race.drivers.lists.c.forEach(function (driver) { if (cleanup(driver.name) === name) { driver.num = num; } });
            });

            return race;
          }, race)
          .end()
          .then(race => {
            if (race) {

              var today = new Date();
              var dst = false;
              var year = Number(today.getFullYear());
              var month = Number(race.details.date.split('/')[0]) - 1;
              var date = Number(race.details.date.split('/')[1]);
              var hour = Number(race.details.dateParts[3]);
              var minute = Number(race.details.dateParts[4]);

              if (race.details.dateParts[6].toLowerCase() !== 'et' && race.details.dateParts[6].toLowerCase() !== 'est') {
                throw new Error('could not get timezone offset');
              }

              if (race.details.dateParts[5].toLowerCase() === 'pm') { hour += 12; }
              if (race.details.dateParts[6].toLowerCase() === 'et') { dst = true; }

              var eastCoastUTCOffset; 
              if (dst) {
                eastCoastUTCOffset = 1000 * 60 * 60 * 4;
              }
              else {
                eastCoastUTCOffset = 1000 * 60 * 60 * 5;
              }
              var raceDateTime = new Date(year, month, date, hour, minute);

              race.details.timestamps.created = Date.now();
              race.details.timestamps.start = raceDateTime.getTime() + eastCoastUTCOffset;

              resolve(race);
            }
            else { reject(new Error('race could not be created. race data is not available')); }
          })
          .catch(reject);
        })
        .catch(reject);
      }
      catch (e) { reject(e); }
    });
  },

};
