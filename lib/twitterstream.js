var VERSION = '0.1.0',
    request = require('request'),
    events = require('events'),
    util = require('util'),
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
    events.EventEmitter.call(this);
}

util.inherits(TwitterStream, events.EventEmitter);

TwitterStream.prototype.stream = function(params) {
    var endpoint = 'https://stream.twitter.com/1.1/statuses/filter.json',
        self = this;
    var stream = request.post({
        uri: endpoint,
        oauth: { 
            consumer_key : this.options.consumer_key,
            consumer_secret : this.options.consumer_secret,
            token: this.options.access_token,
            token_secret: this.options.access_token_secret
        },
        form: params
    }, function(err, res, body) {
        console.log(res.headers);
    });
    stream.on('data', function(chunk) {
        self.emit('data', chunk);
    });
}

module.exports = TwitterStream;
