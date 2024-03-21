import { Schema, models, model } from 'mongoose';

const memberRoleEnum = ['ADMIN', 'MODERATOR', 'GUEST'];

const memberSchema = new Schema({
    role: {
        type: String,
        enum: memberRoleEnum,
        default: 'GUEST'
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    serverId: { type: Schema.Types.ObjectId, required: true, ref: 'Server' },
    
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    
    directMessages: [{ type: Schema.Types.ObjectId, ref: 'DirectMessage' }],
    
    conversationsInitiated: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
    conversationsReceived: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

memberSchema.index({ userId: 1 });
memberSchema.index({ serverId: 1 });

const Member = models.Member || model('Member', memberSchema);

export default Member;
