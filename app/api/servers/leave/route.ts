import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import Member from "@/models/member";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        const { userId, serverId } = await req.json();
        
        // Find the server with the given serverId
        const server = await Server.findOne({ _id: new ObjectId(serverId) });
        
        //find all the members in members collection by userId and serverId and delete the members
        const member = await Member.find({userId: new ObjectId(userId), serverId: new ObjectId(serverId)});
        await member.forEach(async (member) => {
            server.members = server.members.filter((mem) => mem.toString() !== member._id.toString());
            await member.deleteOne();
        }
        );

        //delete the userIds from server's newmembers array
        server.newmembers = server.newmembers.filter((newmember) => newmember.userId.toString() !== userId);

        await server.save();

        return NextResponse.json({ server });

    } catch (error) {
        console.error(error);
    }
}