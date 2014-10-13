var cfg = require('config');

exports.formatTrack = function() {
    return cfg.has('tracks.'+this) ? cfg.get('tracks').get(this) : this;
};

exports.formatCar = function() {
    return cfg.has('cars.'+this) ? cfg.get('cars').get(this) : this;
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
