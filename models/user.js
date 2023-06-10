const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    alamat: { type: String },
    noHp: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: false },
    foto: {type: String},
  },
  {
    timestamp: true
  });
  
  module.exports = mongoose.model('User', userSchema);