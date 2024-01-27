const mongoose = require('mongoose');

const memberRoleEnum = ['ADMIN', 'MODERATOR', 'GUEST'];

const memberSchema = new mongoose.Schema({
  _id: String,
  role: {
    type: String,
    enum: memberRoleEnum,
    default: 'GUEST'
  },
  profileId: String,
  serverId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;