var BackoffStrategy = function (options) {
    this.options = options;
    this.name = 'base';
};

BackoffStrategy.prototype.time_to_wait = function (num_prev_attempt) {
    throw new Error('not implemented');
};

var TcpBackoffStrategy = function (options) {
    BackoffStrategy.call(this, options);
    this.name = 'tcp';
};

TcpBackoffStrategy.prototype.time_to_wait = function (num_prev_attempt) {
    return Math.min(num_prev_attempt * this.options.tcp_timeout_increase,
                    this.options.tcp_timeout_max);
};

var HttpBackoffStrategy = function (options) {
    BackoffStrategy.call(this, options);
    this.name = 'http';
};

HttpBackoffStrategy.prototype.time_to_wait = function (num_prev_attempt) {
    return num_prev_attempt === 0 ? 
           0 :
           Math.min(this.options.http_timeout_base *
                       Math.pow(2, num_prev_attempt - 1),
                    this.options.http_timeout_max);
};

var Http420BackoffStrategy = function (options) {
    BackoffStrategy.call(this, options);
    this.name = 'http420';
};

Http420BackoffStrategy.prototype.time_to_wait = function (num_prev_attempt) {
    return num_prev_attempt === 0 ? 
           0 :
           this.options.http420_timeout_base *
               Math.pow(2, num_prev_attempt - 1);
};

var pickStrategy = function (statusCode, options) {
    if(statusCode === 200) return new TcpBackoffStrategy(options);
    else if (statusCode === 420) return new Http420BackoffStrategy(options);
    else return new HttpBackoffStrategy(options);
};

module.exports = {
    TcpBackoffStrategy: TcpBackoffStrategy,
    HttpBackoffStrategy: HttpBackoffStrategy,
    Http420BackoffStrategy: Http420BackoffStrategy,
    pickStrategy: pickStrategy
};
