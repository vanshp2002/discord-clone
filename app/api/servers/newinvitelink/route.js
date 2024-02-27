import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import { ObjectId } from "mongodb"; // Import ObjectId


export async function POST(req) {
    try{
        await connectMongoDB();
        const {serverId} = await req.json();
        const objectId = new ObjectId(serverId);
        const newLink = uuidv4();
        const server = await Server.updateOne(
            { _id: objectId },
            { $set: { inviteCode: newLink} }
        );

        if (!server) {
            return NextResponse.error(new Error("Server not found"));
        }
        
        return NextResponse.json({status: 200, message: "Invite code updated successfully" });

    }
    catch(error){
        console.log(error);
    }
}