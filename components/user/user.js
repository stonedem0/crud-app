const mongoose = require('mongoose');
const { Schema } = mongoose; 
const userSchema = new Schema({
  user_id: String,
  displayName: String
  });

const User =  mongoose.model('User', userSchema);
module.exports = User
