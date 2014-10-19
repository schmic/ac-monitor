var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var cfg = require('config');
var User = require('../models/user');

// http://steamcommunity.com/dev

// Passport session setup.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findBySteamId(id, function(err, user) {
        // FIXME: error handling
        done(null, user);
    });
});

passport.use(
    new SteamStrategy({
            returnURL: 'http://' + cfg.get('http.host') + ':' + cfg.get('http.port') + '/auth/return',
            realm: 'http://' + cfg.get('http.host') + ':' + cfg.get('http.port') + '/',
            apiKey: cfg.get('steam.api.key')
        },
        function (identifier, profile, done) {
            profile._json.isAdmin = profile.id in cfg.ACM.admins;
            User.save(profile._json, function(err, result) {
                // FIXME: error handling
                return done(null, profile);
            });
        }
    )
);

if(cfg.steam.api.key.length !== 32) {
    throw new Error('Steam API Key is missing/wrong, must be 32 characters long!');
}

module.exports = passport;
