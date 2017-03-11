module.exports = function (deps) {

  const config = deps.config;
  const rollbar = require('rollbar');
  rollbar.init(config.logging.rollbar.token, config.logging.rollbar.config);
  rollbar.handleUncaughtExceptionsAndRejections(config.logging.rollbar.token, config.logging.rollbar.options);

  const loggingLevelMap = { 'debug' : 1, 'info' : 2, 'warning' : 3, 'error' : 4, 'critical' : 5 };
  
  const consoleLoggingEnabled = config.logging.console.enabled;
  const consoleLoggingLevel = config.logging.console.minimumLevel;
  const consoleLoggingLevelPriority = loggingLevelMap[consoleLoggingLevel] || 0;
  
  const _e0 = function () { _logToConsole('info', 'exiting with success'); process.exit(0); };
  const _e1 = function () { _logToConsole('info', 'exiting with failure'); process.exit(1); };

  const _logToConsole = function (level, log) {
    if (consoleLoggingEnabled) {
      if ((loggingLevelMap[level] || 0) >= consoleLoggingLevelPriority) {
        if (log instanceof Error) { console.error(`${new Date()}: ${log}`); }
        else { console.log(`${new Date()}: ${log}`); }
      }
    }
  };

  const _logger = function (level = 'info', log = '', payload = {}, cb, ...cbArgs) {
    // @param  level  can be 'debug', 'info', 'warning', 'error', or 'critical'
    if (log instanceof Error) {
      rollbar.handleErrorWithPayloadData(log, {
        level: level,
        custom: payload
      }, null, () => { if (cb) { cb(cbArgs); } });
    }
    else {
      rollbar.reportMessageWithPayloadData(log, {
        level: level,
        custom: payload
      }, null, () => { if (cb) { cb(cbArgs); } });
    }
    _logToConsole(level, log);
  };

  const logger = {
    debug: (a,b,c,...d) => { return _logger('debug',a,b,c,d) },
    info: (a,b,c,...d) => { return _logger('info',a,b,c,d) },
    warning: (a,b,c,...d) => { return _logger('warning',a,b,c,d) },
    error: (a,b,c,...d) => { return _logger('error',a,b,c,d) },
    critical: (a,b,c,...d) => { return _logger('critical',a,b,c,d) },
    exit: {
      debug: (a,b) => { return _logger('debug',a,b, _e0) },
      info: (a,b) => { return _logger('info',a,b, _e0) },
      warning: (a,b) => { return _logger('warning',a,b, _e0) },
      error: (a,b) => { return _logger('error',a,b, _e1) },
      critical: (a,b) => { return _logger('critical',a,b, _e1) },
    },
  };

  return logger;

};
