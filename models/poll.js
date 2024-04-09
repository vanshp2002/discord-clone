import mongoose, { Schema, models } from 'mongoose';

const pollSchema = new Schema(
    {
        question: {
            type: String,
            required: true
        },
        options: [],
        deleted: {
            type: Boolean,
            default: false
        },
        allowMultiple: {
            type: Boolean,
            default: false
        },
    }, { timestamps: true }
);

const Poll = models.Poll || mongoose.model('Poll', pollSchema);

export default Poll;