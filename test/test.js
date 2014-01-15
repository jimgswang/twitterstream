#!/usr/bin/env node 
var TwitterStream = require('../lib/twitterstream');

var stream = new TwitterStream({
    consumer_key: 'iD7bZqVuG4hE5v0CQmZP5Q',
    consumer_secret: '6wiYWU3XmvIW8rwBQB3STsjqSnsqqBIFoTGQcnQ4',
    access_token: '1796835858-oJsbQTNNPbm7bLxdcpMJkxOFIUpyzVVYvQM174z',
    access_token_secret: 'UboOR3JwElUYqPe8wcWbYz90CwRvAmR3bGHDPkTxBoc'
});

stream.stream({
    track: '#Canucks'
});

stream.on('data', function(data) {
    console.log(data);
});
