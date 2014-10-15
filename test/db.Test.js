var assert = require('assert');
var db = require('../libs/db');

describe('Database', function(){
    // before(function() {});
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, db);
            db.users.insert({user: 'foo', name: 'bar', email: 'foo@bar.org'}, function(err, result) {
                assert.equal(null, err);
                console.log('result:', result);
                db.users.findOne({user: 'foo'}, function(err, item) {
                    assert.equal(null, err);
                    assert.equal('foo', item.user);
                    console.log('user', item.user);
                    db.users.delete({user: 'foo'}, function(err, item) {
                        assert.equal(null, err);
                        assert.equal('foo', item.user);
                        console.log('user', item.user);
                    });

                });

            });
        });
    });
});