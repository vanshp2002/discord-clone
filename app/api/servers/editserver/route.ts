
import { v4 as uuidv4 } from "uuid";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Server from "@/models/server";
import User from "@/models/user";
import Member from '@/models/member';
import Channel from '@/models/channel';
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    try {
        const {serverId, name, imageUrl} = await req.json();
        const updatedServer = await Server.findByIdAndUpdate(new ObjectId(serverId), { name, imageUrl }, { new: true });
        if (!updatedServer) {
            return NextResponse.json({ error: 'Server not found' });
        }

        // Return the updated server as a response
        return NextResponse.json({ message: 'Server updated successfully', server: updatedServer });

    } catch (error) {
        console.log("error during server POST:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}