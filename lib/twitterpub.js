var VERSION = '0.1.0',
    request = require('request'),
    utils = require('utils');

function TwitterStream(options) {

    var defaults = {
        consumer_key : null,
        consumer_secret : null,
        access_token_key : null,
        access_token_secret : null
    };

    utils.copy(defaults, options);
}



