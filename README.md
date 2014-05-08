twitterstream
==========

A lib for working with Twitter's public stream. Supports reconnections & backoffs on tcp / http errors and rate limiting

Install
--------
    npm install twitterstream

Use
--------

    var TwitterStream = require('twitterstream');

    var stream = new TwitterStream({
        consumer_key: xxxxx,
        consumer_secret: xxxxx,
        access_token: xxxxx,
        access_token_secret: xxxx
    });

    stream.start({ track: 'github' });

    stream.on('data', function() {
        console.log(data);
    });

    stream.stop();
