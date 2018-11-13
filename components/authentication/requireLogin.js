module.exports = (req, res, next) => {
    if (!req.user && process.env.NODE_ENV !== 'test' ) {
      return res.status(401).send({ error: 'You must log in!' });
    }
    next();
  };
  