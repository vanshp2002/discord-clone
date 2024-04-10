import { Schema , models, model } from 'mongoose';

const statusSchema = new Schema({
    src: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

const Status = models.Status || model('Status', statusSchema);

export default Status;
