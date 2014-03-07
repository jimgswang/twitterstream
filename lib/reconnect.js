var VERSION = '0.1.0',
    options = require('../options.json');

exports.backoff = function (time, callback) {
    setTimeout(callback, time);
};
