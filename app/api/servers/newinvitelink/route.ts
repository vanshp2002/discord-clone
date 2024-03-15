import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import { ObjectId } from "mongodb"; 
import next from "next";


export async function POST(req) {
    try{
        await connectMongoDB();
        const {serverId} = await req.json();
        const objectId = new ObjectId(serverId);
        const newLink = uuidv4();
        const server = await Server.updateOne(
            { _id: objectId },
            { $set: { inviteCode: newLink} },
            {new: true}
        );
        
        const updatedServer = await Server.findOne({_id: objectId});

        if (!server) {
            return NextResponse.json({status: 404, message: "Server not found"});
        }
        
        return NextResponse.json(updatedServer);

    }
    catch(error){
        console.log(error);
    }
}