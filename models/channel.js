const mongoose = require('mongoose');

const channelTypeEnum = ['TEXT', 'AUDIO', 'VIDEO'];

const channelSchema = new mongoose.Schema({
  _id: String,
  name: String,
  type: {
    type: String,
    enum: channelTypeEnum,
    default: 'TEXT'
  },
  profileId: String,
  serverId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
