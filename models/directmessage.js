import { Schema, models, model } from 'mongoose';

const directMessageSchema = new Schema({
    content: { type: String },
    fileUrl: { type: String },

    memberId: { type: String, required: true, ref:'Member' },
    conversationId: { type: String, required: true, ref:'Conversation' },
    
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  directMessageSchema.index({ memberId: 1 });
  directMessageSchema.index({ conversationId: 1 });
  
  const DirectMessage = models.DirectMessage || model('DirectMessage', directMessageSchema);
  export default DirectMessage;