var assert = require('assert');

describe('Booking', function(){
    before(function() {
        this.Booking = require('../models/booking');
    });
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, this.Booking);
        });
    });

});