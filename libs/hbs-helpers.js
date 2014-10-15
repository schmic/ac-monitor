var cfg = require('config');

exports.formatTrack = function() {
    return cfg.has('tracks.'+this) ? cfg.get('tracks').get(this) : this;
};

exports.formatCar = function() {
    return cfg.has('cars.'+this) ? cfg.get('cars').get(this) : this;
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

exports.json = function(obj) {
    return JSON.stringify(obj);
};
