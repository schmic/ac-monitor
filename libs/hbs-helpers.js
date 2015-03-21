var Car = require('../models/car');
var Track = require('../models/track');

exports.json = function(obj) {
    return JSON.stringify(obj);
};

exports.formatTrack = function(track, trackConfig) {
    return trackConfig ? Track.getName(track + '-' + trackConfig) : Track.getName(track);
};

exports.formatCar = function(car) {
    return Car.getName(car);
};

exports.formatTimestamp = function() {
    this.tstamp = this.tstamp*1000;
    var d = new Date(this.tstamp);
    return d.toISOString().replace(/[T]/, ' ').split('.000').shift();
};

exports.if_eq = function(a, b, opts) {
    if(a == b)
        return opts.fn(this);
    else
        return opts.inverse(this);
};

exports.formatTime = function(timestr) {
    var t = new Date(timestr);
    return t.toTimeString().split(' (').shift();
};

exports.remainingTime = function(timestr, duration) {
    var now = new Date();
    var end = new Date(timestr);
    end.setMinutes(end.getMinutes()+duration);
    return ((end-now)/1000/60).toFixed(0);
};
