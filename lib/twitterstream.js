var request = require('request'),
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
    this._lastData = Date.now() - options.stall_max;
    events.EventEmitter.call(this);
}

util.inherits(TwitterStream, events.EventEmitter);

TwitterStream.prototype.start = function(params) {

    var self = this;
    self._stream(params);
    self.interval = setInterval(function() {
        self._checkAlive(params);
    }, options.stall_max);
}

TwitterStream.prototype._stream = function stream(params) {
    var endpoint = 'https://stream.twitter.com/1.1/statuses/filter.json',
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

        var strat = backoff.pickStrategy(res.statusCode, options);
        self._restart(strat, params);
    });

    this.request.on('data', function(chunk) {

        // Clear reconnection backoff attempts after successful receive 
        self._reconnAttempts.length = 0;

        data = decoder.write(chunk);
        if(data !== '\r\n') self.emit('data', data);
        self._lastData = Date.now();
    });
}

TwitterStream.prototype._checkAlive = function() {

    if(Date.now() - this._lastData > options.stall_max) {

        // if no data is received after stall timer, count as tcp error 
        var strat = new backoff.TcpBackoffStrategy(options); 
        this._restart(strat);
    }
}

TwitterStream.prototype._restart = function(strat, params) {
    this.stop();

    var numAttempts = this._reconnAttempts.filter(function(item) {
        return item.name === strat.name;
    });

    var wait = strat.time_to_wait(numAttempts.length);

    reconnect.retry_after(wait, this.start.bind(this, params)); 
    this._reconnAttempts.push(strat);
}

TwitterStream.prototype.stop = function() {
    clearInterval(this.interval);
    this.request.abort();

    // aborting request doesn't trigger the request callback
}

module.exports = TwitterStream;
