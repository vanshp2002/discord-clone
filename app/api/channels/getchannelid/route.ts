import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";
import { ObjectId } from "mongodb"; // Import ObjectId


export async function POST(req: Request) {
    try{
        await connectMongoDB();
        const {channelId} = await req.json();
        const objectId = new ObjectId(channelId);

        const channel = await Channel.collection.findOne({ 
            _id: objectId, 
        });
        return NextResponse.json({channel});
    }
    catch(error){
        console.log(error);
    }
}