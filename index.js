const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
// const keys = require('./config/keys');
const authRoutes = require('./routes/auth_routes');
const passport = require('passport');

require('dotenv').config()

require('./config/passport');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('successfully connected to DB')
});

const app = express();
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

app.get('/', async(req, res) => {
    res.render('home.pug')
})

app.get('/profile', async(req, res) => {
    console.log(`render ${req.user}`)
    res.render('profile.pug', {user: req.user.displayName})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port`, PORT);
});
