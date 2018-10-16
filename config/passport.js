const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
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

// Google strategy --------------->
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async(accessToken, refreshToken, profile, done) => {
    console.log(profile)
    try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const user = await new User({googleId: profile.id, displayName: profile.displayName}).save();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}))

//Facebook strategy ---------------->

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'emails']
}, async(accessToken, refreshToken, profile, done) => {
    console.log(profile)
    try {
        const existingUser = await User.findOne({id: profile.id});
        if (existingUser) {
            return done(null, existingUser);
        }
        const user = await new User({id: profile.id, name: profile.displayName}).save();
        done(null, user);
        console.log(`db ${user}`)
    } catch (err) {
        done(err, null);
    }
}));

//Gitub strategy ------------->

