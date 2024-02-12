const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, text: true },
  inviteCode: { type: String, required: true, unique: true},
  profileId: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


const Server = mongoose.models.Server || mongoose.model('Server', serverSchema);

module.exports = Server;
