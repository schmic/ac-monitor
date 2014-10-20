var assert = require('assert');

describe('Event', function(){
    before(function() {
        this.Event = require('../models/event');
    });
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, this.Event);
        });
    });

});