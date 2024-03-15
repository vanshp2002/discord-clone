import User from "./user";
import Channel from "./channel";
import Member from "./member";

const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, text: true },
  inviteCode: { type: String, required: true, unique: true},
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  newmembers:[{_id:false, userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, role: { type: String, default: 'GUEST' }}],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


const Server = mongoose.models.Server || mongoose.model('Server', serverSchema);

module.exports = Server;
