const jwt = require('jsonwebtoken');
const {TOKEN_SECRET} = require('../config/keys');

// JWT Middleware
module.exports = function(req, res, next) {
  const token = req.header('Authorization');
  if(!token) return res.status(401).send('Access Denied');
  try {
      const verified = jwt.verify(token, TOKEN_SECRET);
      req.user = verified;
      next();
  } catch(err) {
      res.status(400).send('Invalid Token');
  }
}