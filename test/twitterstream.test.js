var sinon = require('sinon'),
    request = require('request'),
    events = require('events'),
    options = require('../options.json'),
    should = require('should'),
    reconnect = require('../lib/reconnect'),
    TwitterStream = require('../lib/twitterstream');

describe('twitterstream', function() {

    var stream,
        emitter,
        stub,
        response_cb;

    beforeEach(function() {
        stream = new TwitterStream({
            consumer_key: null,
            consumer_secret: null,
            access_token: null,
            access_token_secret: null
        });

        emitter = new events.EventEmitter();
        emitter.abort = sinon.spy();
        stub = sinon.stub(request, 'post', function(options, cb) {
            response_cb = cb;
            return emitter;
        });

        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        this.clock.restore();
    });

    describe('.start', function() {

        afterEach(function() {
            stub.restore();
        });

        it('should fire data event when request receives data', function(done) {

            stream.on('data', function(data) {
                done();
            });
            
            stream.start({});
            emitter.emit('data', 'test');
        });

        it('should not fire data event when request receives \r\n keep alive', function(done) {

            var spy = sinon.spy(done);
            stream.on('data', spy); 
            stream.start({});
            emitter.emit('data', '\r\n');
            sinon.assert.notCalled(spy);
            done();
        });

        it('should call stop then start after max_stall time with no data event', function() {

            stream.start({});
            var stopSpy = sinon.spy(stream, 'stop');
            var startSpy = sinon.spy(stream, 'start');
            this.clock.tick(options.stall_max);
            stopSpy.should.be.called;
            startSpy.should.be.called;
        });

        it('should not restart after max_stall if data event is fired', function() {

            stream.start({});
            var stopSpy = sinon.spy(stream, 'stop');
            var startSpy = sinon.spy(stream, 'start');
            this.clock.tick(options.stall_max - 1);
            emitter.emit('data', '\r\n');
            this.clock.tick(1);
            stopSpy.should.not.be.called;
            startSpy.should.not.be.called;
        });

        it('should call reconnect.retry start on response end', function() {

            stream.start();
            var spy = sinon.spy(reconnect, 'retry_after');
            response_cb(null, { statusCode:200 }, {});
            

            spy.called.should.be.true;
            spy.calledWith(0).should.be.true;
        });
    });

    describe('.stop', function() {
        it('should call abort function for request', function() {

            var spy = emitter.abort;
            stream.start({});
            stream.stop();
            sinon.assert.calledOnce(spy);
        });
    });
});
