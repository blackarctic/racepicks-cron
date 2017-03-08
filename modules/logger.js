module.exports = (function () {

  const config = require('./../config/config.js');
  const rollbar = require('rollbar');
  rollbar.init(config.rollbar.token, config.rollbar.config);

  const _logger = function (type = 'info', msg = '', payload = {}, cb, ...cbArgs) {
    // @param  type  can be 'debug', 'info', 'warning', 'error', or 'critical'
    let path= payload.path || 'unknown';
    rollbar.reportMessageWithPayloadData(path + ': ' + msg, {
      level: type,
      custom: payload
    }, null, () => { if (cb) { cb(cbArgs); } });
    
    // log to console
    if (type === 'error' || type === 'critical') { console.error(msg); }
    else { console.log(msg); }
  };

  const logger = {
    debug: (a,b,c,...d) => { return _logger('debug',a,b,c,d) },
    info: (a,b,c,...d) => { return _logger('info',a,b,c,d) },
    warning: (a,b,c,...d) => { return _logger('warning',a,b,c,d) },
    error: (a,b,c,...d) => { return _logger('error',a,b,c,d) },
    critical: (a,b,c,...d) => { return _logger('critical',a,b,c,d) },
  };

  return logger;

})();