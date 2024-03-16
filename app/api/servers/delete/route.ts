import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import Member from "@/models/member";
import Channel from "@/models/channel";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        const { userId, serverId } = await req.json();
        
        // Find the server with the given serverId
        const server = await Server.findOne({ _id: new ObjectId(serverId), userId: new ObjectId(userId)});

        if(!server) {
            return new NextResponse("You are not authorized to delete this server", { status: 401 });
        }
        
        // Delete the channels
        await Channel.deleteMany({ serverId: new ObjectId(serverId) });

        //delete the members
        await Member.deleteMany({ serverId: new ObjectId(serverId) });

        // Delete the server
        await server.deleteOne();

        return new NextResponse("Server deleted successfully", { status: 200 });

    } catch (error) {
        console.error(error);
    }
}