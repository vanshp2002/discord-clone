import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Member from "@/models/member";
import Server from "@/models/server";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        
        const { serverId, userId } = await req.json();

        const foundMembers = await Member.find({ serverId: new ObjectId(serverId), userId: new ObjectId(userId) });

        if (!foundMembers) {
            return NextResponse.json({ error: 'Member not found' });
        }
        
        const server = await Server.findById(new ObjectId(serverId));
        let member = foundMembers.find((member) => server.members.includes(member._id));

        //populate the member with the user
        member = await Member.populate(member, { path: 'userId', model: 'User' });

        return NextResponse.json(member);
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(error);
    }
}

