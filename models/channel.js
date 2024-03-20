import { Schema, models, model } from 'mongoose';

const channelTypeEnum = ['TEXT', 'AUDIO', 'VIDEO'];

const channelSchema = new Schema({
  name: String,
  type: {
    type: String, 
    enum: channelTypeEnum,
    default: 'TEXT'
  },
  
  userId: {type: Schema.Types.ObjectId, required: true, ref: 'User' },
  serverId: {type: Schema.Types.ObjectId, required: true, ref: 'Server' },
  
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


const Channel = models.Channel || model('Channel', channelSchema);
export default Channel;