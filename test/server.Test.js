var assert = require('assert');
var serverHandler = require('../libs/server-handler');

describe('Server', function(){
    before(function() {
        this.server = require('../libs/server')('dev01');

    });
    after(function() {
        delete this.server;
    });
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, this.server);
        });
        it('should have an -init logfile', function() {
            assert.equal(true, this.server.logFile);
        });
    });

});