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
            apiKey: cfg.get('steam.api.key')
        },
        function (identifier, profile, done) {
            profile.url = identifier;
            return done(null, profile);
        }
    )
);

if(cfg.steam.api.key.length !== 32) {
    throw new Error('Steam API Key is missing/wrong, must be 32 characters long!');
}

module.exports = passport;
