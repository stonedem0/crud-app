const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const keys = require('./config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('successfully connected to DB')
});

const app = express();
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

app.get('/', async(req, res) => {
    res.render('home.pug')
})

app.get('/profile', async(req, res) => {
    res.render('profile.pug')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port`, PORT);
});
