var VERSION = '0.1.0',
    request = require('request'),
    utils = require('./utils');

function TwitterStream(options) {
    var defaults = {
        consumer_key : null,
        consumer_secret : null,
        access_token : null,
        access_token_secret : null
    };
    utils.copy(defaults, options);
    this.options = defaults;
}

TwitterStream.prototype.stream = function(params) {
    var endpoint = 'https://stream.twitter.com/1.1/statuses/filter.json';
    var stream =request.post({
        uri: endpoint,
        oauth: { 
            consumer_key : this.options.consumer_key,
            consumer_secret : this.options.consumer_secret,
            token: this.options.access_token,
            token_secret: this.options.access_token_secret
        },
        form: params
    }, function(err, res, body) {
        console.log(body);
    });
    stream.on('data', function(chunk) {
        console.log(chunk);
    });
}

module.exports = TwitterStream;
