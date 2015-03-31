var assert = require('assert');

describe('Car', function(){
    before(function() {
        this.Car = require('../libs/content-cars');
    });
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, this.Car);
        });
        it('should have one called ferrari_458_s3', function() {
            assert.notEqual(null, this.Car.findByName('ferrari_458_s3'));
        });
    });

});