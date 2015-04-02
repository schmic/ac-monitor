var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;
var cfg = require('config');
var User = require('../models/user');

var isAdmin = function(identifier) {
    return identifier in cfg.admins;
};

passport.serializeUser(function (profile, done) {
    done(null, { steamid: profile.steamid });
});

passport.deserializeUser(function (user, done) {
    User.findBySteamId(user.steamid, function(err, user) {
        // FIXME: error handling
        done(null, user);
    });
});

passport.use(
    new SteamStrategy({
            returnURL: 'http://' + cfg.get('steam.url.host') + ':' + cfg.get('steam.url.port') + '/auth/return',
            realm: 'http://' + cfg.get('steam.url.host') + ':' + cfg.get('steam.url.port') + '/',
            profile: true,
            apiKey: cfg.get('steam.api.key')
        },
        function (identifier, profile, done) {
            profile = profile._json;
            profile.isAdmin = isAdmin(profile.steamid);
            User.findBySteamId(profile.steamid, function(err, user) {
                if(user) {
                    profile.firstname = user.firstname;
                    profile.lastname = user.lastname;
                }
                User.save(profile, function(err, result) {
                    // FIXME: error handling
                });
                return done(null, profile);
            });
        }
    )
);

if(cfg.steam.api.key.length !== 32) {
    throw new Error('Steam API Key is missing/wrong, must be 32 characters long!');
}

module.exports = passport;
