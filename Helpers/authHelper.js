const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');

module.exports = {
  verifyToken: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'No authorization' });
    }
    //get the token from cookie which is saved when login...(in auth.js)
    //req.headers.authorization.split(' ')[1] --- it splits the authorization header in the space and we get 2 arrays
    const token = req.cookies.auth || req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    //if there is token,run below code
    return jwt.verify(token, dbConfig.secret, (err, decoded) => {
      if (err) {
        //check whether it is valid or not with the current date
        if (err.expiredAt < new Date()) {
          return res.status(500).json({
            message: 'Token has expires. Please login again',
            token: null
          });
        }
        next();
      }
      //if valid, get the data from decoded
      req.user = decoded.data;
      next();
    });
  }
};
