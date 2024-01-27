const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  _id: String,
  name: String,
  imageUrl: String,
  inviteCode: { type: String, unique: true },
  profileId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Server = mongoose.model('Server', serverSchema);

module.exports = Server;
