var sinon = require('sinon'),
    should = require('should'),
    backoff = require('../lib/backoff');

describe('backoff suite', function() {

    var strat,
        options = {
        "tcp_timeout_increase" : 250,
        "tcp_timeout_max" : 16000,
        "http_timeout_base" : 5000,
        "http_timeout_max" : 320000,
        "http420_timeout_base" : 60000
    };

    describe('TcpBackoff', function() {

        beforeEach(function() {
            strat = new backoff.TcpBackoffStrategy(options);
        });

        it('should return 0 as wait time on first attempt', function() {
            strat.time_to_wait(0).should.be.exactly(0);
        });

        it('should return 500 for attempt 3', function() {
            strat.time_to_wait(2).should.be.exactly(500);
        });
    });

    describe('HttpBackoff', function() {

        beforeEach(function() {
            strat = new backoff.HttpBackoffStrategy(options);
        });

        it('should return 0 on first attempt', function() {
            strat.time_to_wait(0).should.be.exactly(0);
        });

        it('should return 10000ms for attempt 3', function() {
            strat.time_to_wait(2).should.be.exactly(10000);
        });

        it('should return 20000ms for attempt 4', function() {
            strat.time_to_wait(3).should.be.exactly(20000);
        });

        it('should return 320000ms maximum', function() {
            strat.time_to_wait(Number.MAX_VALUE).should.be.exactly(320000);
        });
    });

    describe('Http420Backoff', function() {

        beforeEach(function() {
            strat = new backoff.Http420BackoffStrategy(options);
        });

        it('should return 0 on first attempt', function() {
            strat.time_to_wait(0).should.be.exactly(0);
        });

        it('should return 120000ms for attempt 3', function() {
            strat.time_to_wait(2).should.be.exactly(120000);
        });

        it('should return 240000ms for attempt 4', function() {
            strat.time_to_wait(3).should.be.exactly(240000);
        });
    });
});


