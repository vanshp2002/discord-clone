import mongoose, { Schema,models } from 'mongoose';

const messageSchema = new Schema(
    {
        content:{
            type: String,
            required: true
        },
        fileUrl:{
            type: String,
        },
        memberId:{
            type: Schema.Types.ObjectId,
            ref: 'Member',
        },
        channelId:{
            type: Schema.Types.ObjectId,
            ref: 'Channel'
        },
        deleted:{
            type: Boolean,
            default: false
        },
        reactions: [],
        edited: {
            type: Boolean,
            default: false
        },
        reply: {
            type: Object,
        },
        replyExist: {
            type: Boolean,
            default: false
        },
    }, {timestamps: true}
);

const Message = models.Message || mongoose.model('Message', messageSchema);

export default Message;