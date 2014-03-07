var sinon = require('sinon'),
    reconnect = require('../lib/reconnect');
 
describe('reconnect', function() {

    var wait,
        spy;

    beforeEach(function() {
        stub = sinon.stub();
        wait = 200;
        spy = sinon.spy();
        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        this.clock.restore();
    });

    it('should not fire callback before strategy.time_to_wait()', function() {
        reconnect.backoff(wait, spy);
        this.clock.tick(199);
        sinon.assert.notCalled(spy);
    });

    it('should fire callback after strategy.time_to_wait()', function() {
        reconnect.backoff(wait, spy);
        this.clock.tick(200);
        sinon.assert.called(spy);
    });
});
