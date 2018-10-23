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
    req.logout();
    res.redirect('/');
  });

router.get('/google/redirect', passport.authenticate('google'), (req, res) =>{ 

    res.redirect('/profile');
})



router.get('/facebook',
  passport.authenticate('facebook', {scope:'email'}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });


router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });


  // mock router 



module.exports = router;