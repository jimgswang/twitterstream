var sinon = require('sinon'),
    nock = require('nock'),
    TwitterStream = require('../lib/twitterstream');

describe('twitterstream', function() {

    var stream, scope;
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
    });

    describe('.stream', function() {
        it.skip('should fire data event on successful response', function(done) {
            scope.reply(200, {stuff : 'test'});
            stream.on('data', function(data) {
                done();
            });
            
            stream.stream({});
        });

    });
});
