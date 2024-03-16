import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import Channel from "@/models/channel";
import { ObjectId } from "mongodb"; 

export async function POST(req) {
    try {
        await connectMongoDB();
        const { serverId, userId, name, type } = await req.json();

        const server = await Server.findOne({ _id: new ObjectId(serverId) });

        if (!server) {
            return new NextResponse("Server not found", { status: 404 });
        }

        const newChannel = new Channel({ name, userId, type, serverId: server._id });

        await newChannel.save();

        server.channels.push(newChannel._id);

        await server.save();

        return NextResponse.json({ server });
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}