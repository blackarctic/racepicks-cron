module.exports = {
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
  'rollbar': {
    'token': '',
    'config': {
      'enabled': true,
      'environment': 'staging',
      'endpoint': 'https://api.rollbar.com/api/1/',
      'minimumLevel': 'debug',
    },
    'options': {
      'exitOnUncaughtException': true,
    },
  },
};
