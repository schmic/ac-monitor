var assert = require('assert');

describe('Track', function(){
    before(function() {
        this.Track = require('../models/track');
    });
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, this.Track);
        });
        it('should have one called spa', function() {
            assert.notEqual(null, this.Track.findByName('spa'));
        });
    });

});