
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
        const {channelId, name, type} = await req.json();
        const updatedChannel = await Channel.findByIdAndUpdate(new ObjectId(channelId), { name, type }, { new: true });
        if (!updatedChannel) {
            return NextResponse.json({ error: 'Channel not found' });
        }

        // Return the updated server as a response
        return NextResponse.json({ message: 'Channel updated successfully', channel: updatedChannel });

    } catch (error) {
        console.log("error during server POST:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}