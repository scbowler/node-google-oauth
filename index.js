const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const { db_connect, cookieKey } = require('./config/keys');
const PORT = process.env.PORT || 9000;

require('./models/user');
require('./services/passport');

mongoose.connect(db_connect).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Error connecting to MongoDB:', err.message);
});

const app = express();

app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

require('./routes/auth')(app);

// To set up Google oAuth
// https://console.developers.google.com
// 1. Create new project
// 2. Click enable API
// 3. Search google+
// 4. Enable API
// 5. Go to Credentials
// 6. Create credentials - OAuth client ID
// 7. Configure consent screen
//      a. Product name
// 8. Select Web Application
//      a. Name - no change
//      b. Authorized JavaScript origins - http://localhost:9000 (change port as needed)
//      c. Authorized redirect URIs - http://localhost:9000/*
//      d. Click Create
// 9. Create keys.js file with clientId and clientSecret
// 10. Set up strategy and /auth/google route
// 11. Test route - fix redirect URI issue
// 12. Visit provided URL to fix issue
//      a. If redirect fails - go to credentials and edit related credential

app.listen(PORT, () => {
    console.log('Server running on PORT: ' + PORT);
});
