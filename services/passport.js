const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId).then(existingUser => {
        done(null, existingUser);
    });
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // console.log('AccessToken:', accessToken);
    // console.log('Refresh Token:', refreshToken);
    // console.log('Profile:', profile);

    User.findOne({googleId: profile.id}).then( existingUser => {
        
        if (existingUser) {
            console.log('Found User');
            done(null, existingUser);
        } else {
            console.log('Created User');
            new User({ googleId: profile.id }).save().then(newUser => {
                done(null, newUser);
            }).catch(err => {
                console.log('Error saving user:', err.message);
            });
        }
    }).catch(err => {
        console.log('Find One Error:', err.message);
    });
}));
