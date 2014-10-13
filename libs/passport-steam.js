var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var cfg = require('config');

// http://steamcommunity.com/dev

// Passport session setup.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(
    new SteamStrategy({
            returnURL: 'http://' + cfg.get('http.host') + ':' + cfg.get('http.port') + '/auth/return',
            realm: 'http://' + cfg.get('http.host') + ':' + cfg.get('http.port') + '/',
            apiKey: cfg.get('Steam.api.key')
        },
        function (identifier, profile, done) {
            profile.url = identifier;
            return done(null, profile);
        }
    )
);

module.exports = passport;
