// http://steamcommunity.com/dev

var passport      = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var cfg           = require('../config');

// Passport session setup.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(
    new SteamStrategy({
            returnURL: 'http://' + cfg.http.host + ':' + cfg.http.port + '/auth/return',
            realm: 'http://' + cfg.http.host + ':' + cfg.http.port + '/',
            apiKey: cfg.steam.api_key
        },
        function (identifier, profile, done) {
            profile.url = identifier;
            return done(null, profile);
        }
    )
);

module.exports = passport;