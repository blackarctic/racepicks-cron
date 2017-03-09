module.exports = {

  getRaceInfo: function (deps) {
    return new Promise((resolve, reject) => {
      try {
        const common = deps.common;
        const Nightmare = deps.Nightmare;

        let race = common.defaults.race();

        Nightmare({show: false})
        .goto('https://racing.fantasysports.yahoo.com/auto/playerdistribution')
        .inject('js', './node_modules/jquery/dist/jquery.min.js')
        .evaluate((race) => {

          // get event info
          var eventInfo = $('#event-info');
          race.name = eventInfo.find('h3').html().split('<em>')[0].trim();
          race.date = eventInfo.find('h3 em').text().trim();
          race.track = $('#event-details #venue p:nth-of-type(2)').text().trim();

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
          .goto('http://www.nascar.com/racecenter.html')
          .inject('js', './node_modules/jquery/dist/jquery.min.js')
          .evaluate((race) => {

            // check that nascar.com and yahoo.com are both on the same race
            var track = $('#nascar-live .race-details .race-name').text();
            if (race.track !== track) { 
              return null;
            }

            // get date & time of race
            var parts = $('#nascar-live .race-date').text().trim().split(/[ :]/)
              .map(x => x.replace(/[^\w\d]/, '')).filter(x => x !== '');

            var today = new Date();
            var year = today.getFullYear();
            var month = race.date.split('/')[0] - 1;
            var date = race.date.split('/')[1];
            var hour = Number(parts[3]);
            var minute = Number(parts[4]);

            if (parts[5].toLowerCase() === 'pm') { hour += 12; }

            var raceDateTime = new Date(year, month, date, hour, minute);

            if (raceDateTime.getTime() < today.getTime()) {
              raceDateTime = new Date(year+1, month, date, hour, minute);
            }

            race.timestamps.created = today.getTime();
            race.timestamps.start = raceDateTime.getTime();

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
            if (race) { resolve(race); }
            else { reject(new Error('race data is not available')); }
          })
          .catch(reject);
        })
        .catch(reject);
      }
      catch (e) { reject(e); }
    });
  },

};
