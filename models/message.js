import { Schema, models, model } from 'mongoose';

const messageSchema = new Schema({
    content: { type: String },
    fileUrl: { type: String },
    memberId: { type: Schema.Types.ObjectId, required: true, ref: 'Message' },
    channelId: { type: Schema.Types.ObjectId, required: true, ref: 'Channel' },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  messageSchema.index({ channelId: 1 });
  messageSchema.index({ memberId: 1 });
  
  const Message = models.Message || model('Message', messageSchema);
  export default Message;