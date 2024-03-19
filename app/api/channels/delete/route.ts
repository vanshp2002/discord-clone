import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Channel from "@/models/channel";
import Server from "@/models/server";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        
        const { serverId, channelId } = await req.json();

        const [server2, deletedChannel] = await Promise.all([
            Server.findByIdAndUpdate(serverId, { $pull: { channels: channelId } }, { new: true }).populate('channels').populate('members'),
            Channel.findByIdAndDelete(channelId)
        ]);

        const server = await Server.populate(server2, {
            path: 'members.userId',
            model: 'User'
        });

        server.members.sort((a, b) => {
            if (a.role === "ADMIN") return -1;
            if (b.role === "ADMIN") return 1;
            if (a.role === "MODERATOR") return -1;
            if (b.role === "MODERATOR") return 1;
            if (a.role === "GUEST") return -1;
            if (b.role === "GUEST") return 1;
        });

        server.newmembers.sort((a, b) => {
            if (a.role === "ADMIN") return -1;
            if (b.role === "ADMIN") return 1;
            if (a.role === "MODERATOR") return -1;
            if (b.role === "MODERATOR") return 1;
            if (a.role === "GUEST") return -1;
            if (b.role === "GUEST") return 1;
        });

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