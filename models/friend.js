import mongoose, { Schema, models, model } from 'mongoose';

const friendSchema = new Schema(
    {
        userOneId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        userTwoId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        status: {
            type: String,
            default: 'PENDING'
        },
        blockedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },

    }, { timestamps: true }
);

const Friend = models.Friend || mongoose.model('Friend', friendSchema);

export default Friend;