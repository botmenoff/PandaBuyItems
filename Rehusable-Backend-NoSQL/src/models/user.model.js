const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar: {type: String, required: true},
  password: { type: String, required: true },
  isBanned: { type: Boolean, default: false },
  verifiedEmail: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);
module.exports = User;
