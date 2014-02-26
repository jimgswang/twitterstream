var sinon = require('sinon'),
    should = require('should'),
    reconnect = require('../lib/reconnect');
 
describe('reconnect', function() {

    var stub,
        spy;

    beforeEach(function() {
        stub = sinon.stub();
        stub.time_to_wait = function() {
            return 200;
        };
        spy = sinon.spy();
        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        this.clock.restore();
    });

    it('should not fire callback before strategy.time_to_wait()', function() {
        reconnect.backoff(stub, spy);
        this.clock.tick(199);
        sinon.assert.notCalled(spy);
    });

    it('should fire callback after strategy.time_to_wait()', function() {
        reconnect.backoff(stub, spy);
        this.clock.tick(200);
        sinon.assert.called(spy);
    });
});
