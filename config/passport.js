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
    callbackURL: '/auth/facebook/callback',
    profileFields:['id','displayName','emails']
}, async(accessToken, refreshToken, profile, done) => {
    console.log(profile)
    try {
        const existingUser = await User.findOne({email:profile.emails[0].value});
        if (existingUser) {
            return done(null, existingUser);
        }
        const user = await new User({email:profile.emails[0].value,name:profile.displayName}).save();        
        done(null, user);
        console.log(`db ${user}`)
    } catch (err) {
        done(err, null);
    }
}));

