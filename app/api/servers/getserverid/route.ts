import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import { ObjectId } from "mongodb"; // Import ObjectId


export async function POST(req: Request) {
    try{
        await connectMongoDB();
        const {serverId, profileId} = await req.json();
        const objectId = new ObjectId(serverId);

        const server = await Server.collection.findOne({ 
            _id: objectId, 
            // 'members.profileId': profileId 
        });
        return NextResponse.json({server});
    }
    catch(error){
        console.log(error);
    }
}