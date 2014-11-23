var path = require('path');
var assert = require('assert');

describe('Parser', function() {
    before(function() {
        this.server = require('../../libs/server')('CCN1_E02-Race-Grid 2');
    });
    // after(function() {});
    // beforeEach(function() {});
    // afterEach(function() {});
    describe('objectCheck', function() {
        it('should not be undefined', function() {
            assert.notEqual(undefined, this.server);
        });
    });

    describe('inputstream01.log', function() {
        it('should be parsed', function(done) {
            this.timeout(10000);
            var logFile = path.join('test', 'data', 'inputstream01.log');
            var stream = require('fs').createReadStream(logFile);

            require('../../libs/server-parser')(this.server, stream);

            stream.on('end', function(server) {
                console.log(server);
                done();
            }.bind(null, this.server));
        });
    });
});