import { Schema, models, model } from 'mongoose';


const serverSchema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, text: true },
  inviteCode: { type: String, required: true, unique: true},

  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
  
  members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
  
});

const Server = models.Server || model('Server', serverSchema);

export default Server;