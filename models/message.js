import mongoose, { Schema, models } from 'mongoose';

const messageSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        replyExist: {
            type: Boolean,
            default: false
        },
        replyId:{
            type: Schema.Types.ObjectId,
            ref: 'Message',
        },
        replyContent: {
            type: String
        },
        replyName:{
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
            ref: 'Member',
        },
        channelId: {
            type: Schema.Types.ObjectId,
            ref: 'Channel'
        },
        deleted: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true }
);

const Message = models.Message || mongoose.model('Message', messageSchema);

export default Message;