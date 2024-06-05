const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  user_name: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birth_date: { type: Date, required: true },
  followers_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followed_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  profil_image_url: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  create_at: { type: Date, required: true, default: Date.now }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);