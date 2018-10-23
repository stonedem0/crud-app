const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const mongoose = require('mongoose');


const User = require('../user/user')

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
        const existingUser = await User.findOne({user_id: profile.id});
        if (existingUser) {
            console.log(profile.id)
            return done(null, existingUser);
        }
        const user = await new User({user_id: profile.id, displayName: profile.displayName}).save();
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
    try {
        const existingUser = await User.findOne({user_id: profile.id});
        if (existingUser) {
            return done(null, existingUser);
        }
        const user = await new User({user_id: profile.id, displayName: profile.displayName}).save();
        done(null, user);
        console.log(`db ${user}`)
    } catch (err) {
        done(err, null);
    }
}));

//Gitub strategy ------------->
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, async(accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({user_id: profile.id});
        if (existingUser) {
            return done(null, existingUser);
        }
        const user = await new User({user_id: profile.id, displayName: profile.displayName}).save();
        done(null, user);
        console.log(`db ${user}`)
    } catch (err) {
        done(err, null);
    }
}));
