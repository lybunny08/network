const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  user_name: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birth_date: { type: Date, required: true },
  gender: { type: String, required: true },
  phone_number:{ type: Number, required: false },
  email: { type: String, required: false },
  create_at: { type: Date, required: true },
  update_at: { type: Date, required: false }
});

module.exports = mongoose.model('User', UserSchema);