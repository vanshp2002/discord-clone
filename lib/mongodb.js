import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');  
    }
    catch(error){
        console.log("Error connecting to mongodb", error);
    }
};