var cfg = require('config');

exports.formatTrack = function() {
    return cfg.has('tracks.'+this) ? cfg.get('tracks').get(this) : this;
};

exports.formatCar = function() {
    return cfg.has('cars.'+this) ? cfg.get('cars').get(this) : this;
};
