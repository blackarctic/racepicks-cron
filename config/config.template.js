module.exports = {
  'endpoints': {
    'nascar': {
      'racecenter': 'http://www.nascar.com/racecenter.html',
    },
    'yahoo' : {
      'playerdistribution': 'https://racing.fantasysports.yahoo.com/auto/playerdistribution',
    }
  },
  'server': {
    'firebase': {
      'email': '',
      'password': '',
      'config': {
        'apiKey': "",
        'authDomain': "",
        'databaseURL': "",
        'storageBucket': "",
        'messagingSenderId': "",
      },
    },
  },
  'logging': {
    'rollbar': {
      'token': '',
      'config': {
        'enabled': true,
        'environment': '',
        'endpoint': 'https://api.rollbar.com/api/1/',
        'minimumLevel': 'info',
      },
      'options': {
        'exitOnUncaughtException': true,
      },
    },
    'console': {
      'enabled': true,
      'minimumLevel': 'debug',
    }
  }
};
