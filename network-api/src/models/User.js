const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const hashtagSchema = new mongoose.Schema({
  hashtag: { type: String, required: true },
  addedAt: { type: Date, required: true, default: Date.now }
});

const searchSchema = new mongoose.Schema({
  searchKey: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now }
});

const likedPostSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  likedAt: { type: Date, required: true, default: Date.now }
});

const followerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, required: true, default: Date.now }
});

const profileImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true, minlength: 3, maxlength: 50 },
  firstName: { type: String, required: true, minlength: 1, maxlength: 50 },
  lastName: { type: String, required: true, minlength: 1, maxlength: 50 },
  birthDate: { type: Date, required: true },
  location: { type: String, required: false, maxlength: 100 },
  favoriteHashtags: [hashtagSchema],
  searches: [searchSchema],
  likedPosts: [likedPostSchema],
  followers: [followerSchema],
  followed: [followerSchema], // Réutilisation du schema `followerSchema`
  profileImages: [profileImageSchema],
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, required: true, default: Date.now }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
