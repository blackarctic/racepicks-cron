module.exports = function (deps) {
  const env = deps.env;
  return {
    'endpoints': {
      'nascar': {
        'racecenter': env.CONFIG_ENDPOINTS_NASCAR_RACECENTER,
      },
      'yahoo' : {
        'playerdistribution': env.CONFIG_ENDPOINTS_YAHOO_PLAYERDISTRIBUTION,
      }
    },
    'server': {
      'firebase': {
        'email': env.CONFIG_SERVER_FIREBASE_EMAIL,
        'password': env.CONFIG_SERVER_FIREBASE_PASSWORD,
        'config': {
          'apiKey': env.CONFIG_SERVER_FIREBASE_CONFIG_APIKEY,
          'authDomain': env.CONFIG_SERVER_FIREBASE_CONFIG_AUTHDOMAIN,
          'databaseURL': env.CONFIG_SERVER_FIREBASE_CONFIG_DATABASEURL,
          'storageBucket': env.CONFIG_SERVER_FIREBASE_CONFIG_STORAGEBUCKET,
          'messagingSenderId': env.CONFIG_SERVER_FIREBASE_CONFIG_MESSAGINGSENDERID,
        },
      },
    },
    'logging': {
      'rollbar': {
        'token': env.CONFIG_LOGGING_ROLLBAR_TOKEN,
        'config': {
          'enabled': env.CONFIG_LOGGING_ROLLBAR_CONFIG_ENABLED === "TRUE",
          'environment': env.CONFIG_LOGGING_ROLLBAR_CONFIG_ENVIRONMENT,
          //'endpoint': env.CONFIG_LOGGING_ROLLBAR_CONFIG_ENDPOINT,
          'minimumLevel': env.CONFIG_LOGGING_ROLLBAR_CONFIG_MINIMUMLEVEL,
        },
        'options': {
          'exitOnUncaughtException': env.CONFIG_LOGGING_ROLLBAR_OPTIONS_EXITONUNCAUGHTEXCEPTION === "TRUE",
        },
      },
      'console': {
        'enabled': env.CONFIG_LOGGING_CONSOLE_ENABLED === "TRUE",
        'minimumLevel': env.CONFIG_LOGGING_CONSOLE_MINIMUMLEVEL,
      }
    }
  };
};
