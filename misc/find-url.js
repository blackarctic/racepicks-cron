const axios = require('axios');

const start = 4000;
const limit = 2000;  // start + limit = end
const threads = 200;

for (var i=0; i<threads; i++) {
  scan(start+i);
}

function scan (i) {
  axios.get('http://www.nascar.com/live/feeds/series_1/'+i+'/live_feed.json')
  .then(function (response) {
    if (response.data.series_id = "1" && response.data.run_name === "Daytona 500") {
      console.log("found one");
    }
    if (i < start+limit) {
      scan(i+threads);
    }
  })
  .catch(function (error) {
    if (i < start+limit) {
      scan(i+threads);
    }
  });
} 