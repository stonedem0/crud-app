const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRoutes = require('./components/authentication/authRoutes');
const passport = require('passport');
const methodOverride = require('method-override')


require('dotenv').config()
require('./components/post/postCache')

require('./components/authentication/passport');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('successfully connected to DB')
});

const app = express();
app.set('view engine', 'pug')
// app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));

app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());


require('./components/post/postRoutes')(app);
require('./components/post/postUploadImage')(app);
app.use('/auth', authRoutes);

app.get('/', async(req, res) => {
    if(req.user) {
        res.redirect('/profile')
        return
    }
    res.render(__dirname +'/components/home/home')
})

app.get('/profile', async(req, res) => {
    console.log(`render ${req.user}`)
    res.render(__dirname +'/components/user/userProfile', {user: req.user.displayName})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port`, PORT);
});


module.exports = app