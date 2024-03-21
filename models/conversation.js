import { Schema, models, model } from 'mongoose';

const conversationSchema = new Schema({
    memberOneId: { type: String, required: true, ref:'Member'},
    memberTwoId: { type: String, required: true, ref:'Member' },
    directMessages: [{ type: Schema.Types.ObjectId, ref: 'DirectMessage' }]
  });
  
  conversationSchema.index({ memberTwoId: 1 });
  conversationSchema.index({ memberOneId: 1, memberTwoId: 1 }, { unique: true });
  
  const Conversation = models.Conversation || model('Conversation', conversationSchema);
  export default Conversation;