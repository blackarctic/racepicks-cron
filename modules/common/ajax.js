module.exports = {

  getLap: function (deps, url) {
    return new Promise((resolve, reject) => {
      try {
        const axios = deps.axios;
        axios.get(url)
        .then(response => {
          try {
            resolve(response.data);
          }
          catch (e) { reject(e); }
        })
        .catch(reject);
      }
      catch (e) { reject(e); }
    });
  },

};
