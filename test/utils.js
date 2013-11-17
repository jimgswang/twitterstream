var utils = require('../lib/utils');
require('should');

describe('utils', function() {
    var o, other;

    describe('copy', function() {

        beforeEach(function() {
            o = {a : '1', b : 2 };
            other = {c : '2', d : [] };
        });

        it('should copy property c of other to o', function() {
            utils.copy(o, other);
            o.c.should.equal('2');
        });

        it('should keep property a of o', function() {
            utils.copy(o, other);
            o.a.should.equal('1');
        });
    });
});
