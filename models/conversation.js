import mongoose, { Schema,models } from 'mongoose';

const conversationSchema = new Schema(
    {
        memberOneId: 
            {
                type: Schema.Types.ObjectId,
                ref: 'Member',
                alias: 'memberOne',
                required: true
            }
        ,
        memberTwoId: 
            {
                type: Schema.Types.ObjectId,
                ref: 'Member',
                alias: 'memberTwo',
                required: true
            }
        ,
        directMessages: 
            [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'DirectMessage'
                }
            ]
        ,
    }, {timestamps: true}
);

conversationSchema.index({ memberOneId: 1, memberTwoId: 1 }, { unique: true });

const Conversation = models.Conversation || mongoose.model('Conversation', conversationSchema);

export default Conversation;