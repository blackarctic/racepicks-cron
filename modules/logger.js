module.exports = function (deps) {

  const config = deps.config;
  const rollbar = require('rollbar');
  rollbar.init(config.rollbar.token, config.rollbar.config);
  rollbar.handleUncaughtExceptionsAndRejections(config.rollbar.token, config.rollbar.options);

  const _e0 = function () { console.log('exiting with success'); process.exit(0); };
  const _e1 = function () { console.log('exiting with failure'); process.exit(1); };

  const _logger = function (type = 'info', log = '', payload = {}, cb, ...cbArgs) {
    // @param  type  can be 'debug', 'info', 'warning', 'error', or 'critical'
    if (log instanceof Error) {
      rollbar.handleErrorWithPayloadData(log, {
        level: type,
        custom: payload
      }, null, () => { if (cb) { cb(cbArgs); } });
    }
    else {
      rollbar.reportMessageWithPayloadData(log, {
        level: type,
        custom: payload
      }, null, () => { if (cb) { cb(cbArgs); } });
    }
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
