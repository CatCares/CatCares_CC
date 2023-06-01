const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    picture: {type: String},
  },
  {
    timestamp: true
  });
  
  module.exports = mongoose.model('User', userSchema);