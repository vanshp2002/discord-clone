import mongoose, { Schema,models } from 'mongoose';

const directMessageSchema = new Schema(
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
            ref: 'User',
        },
        conversationId:{
            type: Schema.Types.ObjectId,
            ref: 'Conversation'
        },
        deleted:{
            type: Boolean,
            default: false
        },
        edited:{
            type: Boolean,
            default: false
        },
        reactions:[],
        reply:{
            type: Object
        },
        replyExist:{
            type: Boolean,
            default: false
        }
    }, {timestamps: true}
);

const DirectMessage = models.DirectMessage || mongoose.model('DirectMessage', directMessageSchema);

export default DirectMessage;