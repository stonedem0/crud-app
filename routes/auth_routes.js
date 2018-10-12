const router = require('express').Router();
const passport = require('passport');

// auth login

router.get('/login', (req, res) => {
    res.send('logging in')
})

// auth with google

router.get('/google', passport.authenticate('google', {
    scope:['profile']

}));

//auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
})

router.get('/google/callback', passport.authenticate('google'), (req, res) =>{ 
    res.send('you reached the callback uri ')
})

module.exports = router;