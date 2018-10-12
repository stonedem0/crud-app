const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys')

passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/callback',
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    //TODO passport callback function
}))