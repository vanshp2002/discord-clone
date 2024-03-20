import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        
        const { channelId } = await req.json();

        const channel = await Channel.findById(new ObjectId(channelId));

        if (!channel) {
            return NextResponse.json({ error: 'Channel not found' });
        }

        return NextResponse.json(channel);
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(error);
    }
}