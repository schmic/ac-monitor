var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var cfg = require('config');
var User = require('../models/user');

var isAdmin = function(identifier) {
    return identifier in cfg.ACM.admin
};

passport.serializeUser(function (user, done) {
    // FIXME: de-/serialize enough user data for session
    console.log('serializeUser', user);
    done(null, user.id);
});

passport.deserializeUser(function (user, done) {
    // FIXME: de-/serialize enough user data for session, as well as "isAdmin"
    console.log('deserializeUser', user);
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
            profile = profile._json;
            profile.isAdmin = isAdmin(identifier);
            User.save(profile, function(err, result) {
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
