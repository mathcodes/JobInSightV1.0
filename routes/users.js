const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {TOKEN_SECRET} = require('../config/keys');
const jwt_decode = require('jwt-decode');

// Auth
const auth = require('../config/auth');

// Models
const Users = require('../models/Users');
const {registerValidation, loginValidation} = require('../models/Users');

/**
 * POST
 * Register User
 */
router.post('/register', async (req, res) => {
  
  // Validate data before we create user
  const {error} = registerValidation(req.body);
  if (error) return res.status(400).json({
    status: 'error',
    type: error.details[0].path,
    message: error.details[0].message
  });

  // Check if email is already in DB
  const emailExists = await Users.findOne({ email: req.body.email });
  if (emailExists) {
    console.log('Email already in Database');
    return res.status(400).json({
      status: 'error',
      type: "email",
      message: "Email has already been registered"
    });
  }

  // Checking if the username is already in the database
  const userExists = await Users.findOne({ username: req.body.username });
  if (userExists) {
    return res.status(400).json({
      status: 'error',
      type: "username",
      message: "Username has already been registered"
    });
  }
  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // Create a new user object
  const newUser = new Users({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });
  // Save user in DB
  try {
    const savedUser = await newUser.save();
    res.json({ savedUser });
  } catch (err) {
    console.log(err);
  }
});

/**
 * POST
 * Login User
 */
router.post('/login', async (req, res) => {
  // Validate before we login user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({
    status: 'error',
    type: error.details[0].path,
    message: error.details[0].message
  });

  // Check if username is in DB
  const user = await Users.findOne({username: req.body.username});
  if (!user) return res.status(400).json({
    status: 'error',
    type: 'username',
    message: 'Username is invalid'
  });

  // Check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      status: 'error',
      type: 'password',
      message: 'Password is invalid'
    });
  }

  // Create and assign token
  const token = jwt.sign({ _id: user._id }, TOKEN_SECRET, {expiresIn: 99999}, (err, token) => {
    // Get user from token
    const decode = jwt_decode(token);
    res.json({
      success: true,
      token: token,
      decode: decode
    });
  });

});

/**
 * GET
 * User Login Data
 */
// GET - user login data -- Improve implementation --
router.get('/getuser', auth, async (req, res) => {
  console.log(req.user);
  const user = await Users.findById(req.user);
  res.send({
    username: user.username,
    email: user.email
  });
});

router.get('/current', auth, async (req, res) => {
  res.send('Test API');
});

// Export
module.exports = router;