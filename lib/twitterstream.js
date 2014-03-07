var VERSION = '0.1.0',
    request = require('request'),
    events = require('events'),
    util = require('util'),
    utils = require('./utils'),
    backoff = require('./backoff'),
    reconnect = require('./reconnect'),
    options = require('../options.json'),
    StringDecoder = require('string_decoder').StringDecoder;

function TwitterStream(options) {
    var defaults = {
        consumer_key : null,
        consumer_secret : null,
        access_token : null,
        access_token_secret : null
    };
    utils.copy(defaults, options);
    this.options = defaults;
    this._reconnAttempts = [];
    events.EventEmitter.call(this);
}

util.inherits(TwitterStream, events.EventEmitter);

TwitterStream.prototype.start = function(params) {

    this.stream(params);
    this.interval = setInterval(function() {
        console.log('interval');
    }, 10000);
}

TwitterStream.prototype.stream = function stream(params) {
    //var endpoint = 'https://stream.twitter.com/1.1/statuses/filter.json',
    var endpoint = 'http://54.218.117.28:8080/stream',
        self = this,
        decoder = new StringDecoder('utf8'),
        data,
        strategy;

    this.request = request.post({
        uri: endpoint,
        oauth: { 
            consumer_key : this.options.consumer_key,
            consumer_secret : this.options.consumer_secret,
            token: this.options.access_token,
            token_secret: this.options.access_token_secret,
            signature_method: 'HMAC-SHA1',
            version: '1.0'
        },
        form: params
    }, function(err, res, body) {
        // res.statusCode
        //strategy = backoff.pickStrategy(res.statusCode, options);
        reconnect.backoff(strategy.time_to_wait(0), stream.bind(self, params));
        self.reconnAttempts.push(strategy);

    });

    this.request.on('data', function(chunk) {

        // Clear reconnection backoff attempts after successful receive 
        self._reconnAttempts.length = 0;

        data = decoder.write(chunk);
        if(data !== '\r\n') self.emit('data', data);
        self._lastData = Math.floor(Date.now() / 1000);
    });
}

TwitterStream.prototype.stop = function() {
    clearInterval(this.interval);
    this.request.abort();

    // aborting request doesn't trigger the request callback
}

module.exports = TwitterStream;
