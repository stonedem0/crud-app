const express = require('express');
const app = express();
const path = require('path')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
    res.render('home.pug')
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port`, PORT);
  });
  