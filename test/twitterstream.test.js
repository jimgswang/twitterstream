var sinon = require('sinon'),
    nock = require('nock'),
    request = require('request'),
    events = require('events'),
    TwitterStream = require('../lib/twitterstream');

describe('twitterstream', function() {

    var stream, scope,
        emitter,
        stub;

    beforeEach(function() {
        scope =  nock('https://stream.twitter.com')
                    .filteringPath(function(path) {
                        return '/1.1/statuses/filter.json';
                    })
                    .post('/1.1/statuses/filter.json');
        stream = new TwitterStream({
            consumer_key: null,
            consumer_secret: null,
            access_token: null,
            access_token_secret: null
        });

        emitter = new events.EventEmitter();
        stub = sinon.stub(request, 'post', function() {
            return emitter;
        });

    });

    afterEach(function() {
        stub.restore();
    });

    describe('.stream', function() {
        it('should fire data event when request receives data', function(done) {

            stream.on('data', function(data) {
                done();
            });
            
            stream.stream({});
            emitter.emit('data', 'test');
        });

        it('should not fire data event when request receives \r\n keep alive', function(done) {

            var spy = sinon.spy(done);
            stream.on('data', spy);

            stream.stream({});
            emitter.emit('data', '\r\n');
            sinon.assert.notCalled(spy);
            done();
        });
    });
});
