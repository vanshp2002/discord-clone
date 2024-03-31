import mongoose, { Schema, models } from 'mongoose';

const directMessageSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        replyExist: {
            type: Boolean,
            default: false
        },
        replyId: {
            type: Schema.Types.ObjectId,
            ref: 'DirectMessage',
        },
        replyContent: {
            type: String
        },
        replyName: {
            type: String
        },
        replyImg: {
            type: String
        },
        fileUrl: {
            type: String,
        },
        memberId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation'
        },
        deleted: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true }
);

const DirectMessage = models.DirectMessage || mongoose.model('DirectMessage', directMessageSchema);

export default DirectMessage;