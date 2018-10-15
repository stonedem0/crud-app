const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const mongoose = require('mongoose');
const keys = require('./keys')

const User = require('../models/User')

passport.serializeUser( (user, done) => {
    console.log("user:", user)
    done(null, user);
});

passport.deserializeUser( (user, done) => {
    done(null, user);
});

passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/callback',
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret
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
    callbackURL: 'auth/facebook/callback'
  },
  async (accessToken, refreshToken, profile, cb) =>{
    try {
        const existingUser = await User.findOne({googleId: profile.id});
        if (existingUser) {
            return done(null, existingUser);
        }
        const user = await new User({facebookId: profile.id}).save();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
  }
));
