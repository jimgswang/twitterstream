var VERSION = '0.1.0',
    options = require('../options.json'),
    num_tcp_errors = 0,
    num_http_errors = 0,
    num_http420_errors = 0;


exports.restart = function restart(statusCode, options, fn) {
    if(statusCode === 420) {
        backoff_http420(fn, options);
    }
    else if(statusCode > 200) {
        backoff_http(fn, options);
    }
    else {
        backoff_tcp(fn, options);
    }
}

exports.reset = function reset() {
    num_tcp_errors = 0;
    num_http_errors = 0;
    num_http420_errors = 0;
}

var backoff_tcp = function backoff_tcp(fn, options) {

    setTimeout(fn, Math.min(num_tcp_errors * options.tcp_timeout_increase, 
                            options.tcp_timeout_max));
    num_tcp_errors++;
}

var backoff_http = function backoff_http(fn, options) {
    if(num_http_errors === 0 ) {
        fn();
    }
    else {
        setTimeout(fn, Math.min(Math.pow(options.http_timeout_base, num_http_errors),
                                options.http_timeout_max));
    }

    num_http_errors++;
}

var backoff_http420 = function backoff_http420(fn, options) {
    if(num_http420_errors === 0 ) {
        fn();
    }
    else {
        setTimeout(fn, Math.pow(options.http420_timeout_base, num_http420_errors));
    }

    num_http420_errors++;
}
