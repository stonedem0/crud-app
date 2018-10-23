const passport = require('passport'),
      StrategyMock = require('./strategy-mock');

function verifyFunction(user, done) {
    const mock = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe'
    };
    done(null, mock);
}
module.exports = function (app, options) {

    passport.use(new StrategyMock(options, verifyFunction));

    app.get('/mock/login', passport.authenticate('mock',{successRedirect: '/',failureRedirect: '/login'}));
};