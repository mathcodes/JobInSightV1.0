const mongoose = require('mongoose');
const Joi = require('joi');

// --- Schema --- 
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
},
email: {
    type: String,
    required: true,
},
password: {
    type: String,
    required: true,
},
date: {
  type: Date,
  default: Date.now
},
});

// --- Validation using Joi --- 
// Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
      username: Joi.string().min(6).max(30).required(),
      email: Joi.string().min(6).max(320).required().email(),
      password: Joi.string().min(6).required()
  });
  return schema.validate(data);
}

// Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(30).required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
}




// Export
module.exports = mongoose.model('Users', userSchema);
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

