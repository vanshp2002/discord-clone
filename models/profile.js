const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  _id: String,
  userId: { type: String, unique: true },
  name: String,
  imageUrl: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Profile = models.Profile || mongoose.model('Profile', profileSchema);

module.exports = Profile;
