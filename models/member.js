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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Define compound index on userId and serverId to ensure uniqueness
const Member = models.Member || model('Member', memberSchema);

export default Member;
