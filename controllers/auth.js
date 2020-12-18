const Joi = require('joi');
const HttpStatus = require('http-status-code');
const User = require('../models/userModels');
const helper = require('../Helpers/helpers');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');

module.exports = {
  //If you dont want to use callback,then use async and await
  async createUser(req, res) {
    const schema = Joi.object().keys({
      username: Joi.string()
        .min(3)
        .max(20)
        .required(),
      password: Joi.string().required(),
      email: Joi.string()
        .email()
        .required()
    });

    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(400).json({ msg: error.details });
    }

    const userEmail = await User.findOne({
      email: helper.lowerCase(req.body.email)
    });
    if (userEmail) {
      return res.status(409).json({ message: 'Email already exist' });
    }

    const userName = await User.findOne({
      username: helper.firstUpper(req.body.username)
    });
    if (userName) {
      return res.status(409).json({ message: 'Username already exist' });
    }

    return bcrypt.hash(value.password, 10, (err, hash) => {
      if (err) {
        return res.status(400).json({ message: 'Error hashing password' });
      }
      const body = {
        username: helper.firstUpper(value.username),
        email: helper.lowerCase(value.email),
        password: hash
      };
      User.create(body)
        .then(user => {
          const token = jwt.sign({ data: user }, dbConfig.secret, {
            expiresIn: '5h'
          });
          //save the token in the cookie in the name of 'auth'...
          res.cookie('auth', token);
          res
            .status(200)
            .json({ message: 'User created successfully', user, token });
        })
        .catch(err => {
          res
            .status(500) //HttpStatus.INTERNAL_SERVER_ERROR
            .json({ message: 'Error occured' });
        });
    });
  },

  async LoginUser(req, res) {
    if (!req.body.username || !req.body.password) {
      return res.status(500).json({ message: 'No empty fields allowed' });
    }
    await User.findOne({ username: helper.firstUpper(req.body.username) })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Username not found' });
        }
        return bcrypt.compare(req.body.password, user.password).then(result => {
          if (!result) {
            return res.status(500).json({ message: 'Password is incorrect' });
          }
          const token = jwt.sign({ data: user }, dbConfig.secret, {
            expiresIn: '1h'
          });
          res.cookie('auth', token);
          return res
            .status(200)
            .json({ message: 'Login successfull', user, token });
        });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error occured' });
      });
  }
};
