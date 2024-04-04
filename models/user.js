import mongoose, { Schema,models } from 'mongoose';

const userSchema = new Schema(
    {
        email:{
            type: String,
            required: true,
            unique: true
        },
        displayname:{
            type: String,
            required: true
        },
        username:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        imageUrl:{
            type: String,
            default: "https://utfs.io/f/0861b5a9-d246-42b0-bdcb-ab8cbb6d2cea-g7cq2y.png"
        },
        note:{
            type: String,
            default: "Add a note here"
        },
        bannerColor:{
            type: String,
            default: "#435EE6"
        },
    }, {timestamps: true}
);

const User = models.User || mongoose.model('User', userSchema);

export default User;