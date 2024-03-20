import mongoose, { Schema,models } from 'mongoose';

const directMessageSchema = new Schema(
    {
        content:{
            type: String,
            required: true
        },
        fileUrl:{
            type: string,
        },
        memberId:{
            type: Schema.Types.ObjectId,
            ref: 'Member',
        },
        conversationId:{
            type: Schema.Types.ObjectId,
            ref: 'Conversation'
        },
        deleted:{
            type: Boolean,
            default: false
        }
    }, {timestamps: true}
);

const DirectMessage = models.DirectMessage || mongoose.model('DirectMessage', directMessageSchema);

export default DirectMessage;