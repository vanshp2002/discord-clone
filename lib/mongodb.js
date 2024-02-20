import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    if(mongoose.connections[0].readyState) return;
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB Connected');  
    }
    catch(error){
        console.log("Error connecting to mongodb", error);
    }
};

