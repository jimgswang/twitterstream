var sinon = require('sinon'),
    should = require('should'),
    reconnect = require('../lib/reconnect');
 
describe.only('reconnect', function() {

    var options 

    beforeEach(function() {
        options = {
            "tcp_timeout_increase" : 250,
            "tcp_timeout_max" : 16000,
            "http_timeout_base" : 5000,
            "http_timeout_max" : 320000,
            "http420_timeout_base" : 60000
        };
    });

    afterEach(function() {
        reconnect.reset();
    });

    describe('first restart attempt', function() {

        beforeEach(function() {
            this.clock = sinon.useFakeTimers();
        });

        afterEach(function() {
            this.clock.restore();
        });

        it('should immediately restart on 200 status on first restart', function(done) {

            reconnect.restart(200, options,  function() {
                done();
            });
            this.clock.tick(1);
        });

        it('should immediately restart on 420 status', function(done) {

            reconnect.restart(420, options, function() {
                done();
            });
            this.clock.tick(1);

        });

        it('should immediately restart on other status', function(done) {

            reconnect.restart(401, options, function() {
                done();
            });
            this.clock.tick(1);

        });

    });

    describe('restart after attempting 2 restarts on 200 status', function() { 

        beforeEach(function(done) {
            reconnect.restart(200, options, function() {
                reconnect.restart(200, options, function() {
                    done();
                    this.clock = sinon.useFakeTimers();
                });
            });
        });

        it('should not restart before 500ms', function(done) {

            var spy = sinon.spy(done);

            reconnect.restart(200, options, function() {
                done();
            });

            this.clock.tick(499);

            sinon.assert.notCalled(spy);
            done();
        });
    });
});
