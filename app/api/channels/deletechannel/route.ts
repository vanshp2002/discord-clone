import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";
import Server from "@/models/server";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        
        const { serverId, channelId } = await req.json();

        const [server, deletedChannel] = await Promise.all([
            Server.findByIdAndUpdate(serverId, { $pull: { channels: channelId } }, { new: true }).populate('channels').populate('channels'),
            Channel.findByIdAndDelete(channelId)
        ]);

        if (!server) {
            return NextResponse.json({ error: "Server not found" });
        }

        if (!deletedChannel) {
            return NextResponse.json({ error: "Member not found" });
        }

        return NextResponse.json({ server });
    } catch (error) {
        console.error(error);
        return NextResponse.json(error);
    }
}
