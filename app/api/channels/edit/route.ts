import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        
        const { channelId, name, type} = await req.json();

        const updatedChannel = await Channel.findByIdAndUpdate(new ObjectId(channelId), { name, type }, { new: true });
        if (!updatedChannel) {
            return NextResponse.json({ error: 'Channel not found' });
        }

        return NextResponse.json({ message: 'Channel updated successfully', channel: updatedChannel });
    } catch (error) {
        console.error(error);
        return NextResponse.json(error);
    }
}