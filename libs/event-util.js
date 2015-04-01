var ac = require('ac-server-ctrl');
var cfg = require('config');

var startAC = function (event, callback) {
    ac.start(event.preset, function startPostAction() {
        if (event.postaction) {
            cfg.actions.post[event.postaction](event.postactionparms, preset, callback);
        }
        else {
            callback();
        }
    });
};

var startEvent = function(eventId, callback) {
    require('../models/event').getOne(eventId, function(err, event) {
        if(err) {
            callback ? callback(err) : console.error(err);
            return;
        }

        if(event.presetstop) {
            ac.stop(event.presetstop);
        }

        if(event.preaction) {
            cfg.actions.pre[event.preaction](event.preactionparms, event.preset, function() {
                startAC(event, callback);
            });
        }
        else {
            startAC(event, callback);
        }
    });
};

module.exports = {
    start: startEvent
};