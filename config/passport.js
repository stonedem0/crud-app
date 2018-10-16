const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys')

const User = require('../models/User')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User
        .findById(id)
        .then(user => {
            done(null, user);
        });
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/redirect',

}, async(accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({googleId: profile.id});
        if (existingUser) {
            return done(null, existingUser);
        }
        const user = await new User({googleId: profile.id, displayName: profile.displayName}).save();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}))

passport.use(new FacebookStrategy({
    clientID: keys.facebookAppID,
    clientSecret: keys.facebookAppSecret,
    callbackURL: '/auth/facebook/callback'
}, async(accessToken, refreshToken, profile, cb) => {
    try {
        const existingUser = await User.findOne({facebookId: profile.id});
        if (existingUser) {
            return done(null, existingUser);
        }
        const user = await new User({facebookId: profile.id}).save();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

