import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Member from "@/models/member";
import Server from "@/models/server";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        
        const { serverId, userId } = await req.json();
        const member = await Member.findOne({ userId: new ObjectId(userId), serverId: new ObjectId(serverId) });

        if (!member) {
            return NextResponse.json({ error: "Member not found" });
        }
        const memberId = member._id;
        const [server, deletedMember] = await Promise.all([
            Server.findByIdAndUpdate(serverId, { $pull: { members: memberId } }, { new: true }).populate('channels').populate('members'),
            Member.findByIdAndDelete(memberId)
        ]);

        if (!server) {
            return NextResponse.json({ error: "Server not found" });
        }

        if (!deletedMember) {
            return NextResponse.json({ error: "Member not found" });
        }

        return NextResponse.json({ "meassage":"Member deleted successfully." });
    } catch (error) {
        console.error(error);
        return NextResponse.error(error);
    }
}
