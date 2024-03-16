import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import Member from "@/models/member";

import { ObjectId } from "mongodb";

export async function POST(req) {
    try{
        const {serverId, memberId, userId} = await req.json();
        await connectMongoDB();
        
        //find all the members in members collection by userId and serverId and delete the members
        const member = await Member.find({userId: new ObjectId(userId), serverId: new ObjectId(serverId)});
        await member.forEach(async (member) => {
            await member.deleteOne();
        }
        );

        let server2 = await Server.findById(serverId);
        let newmembers = server2.newmembers;
        newmembers = newmembers.filter((newmember) => newmember.userId.toString() !== userId);
        server2.newmembers = newmembers;

        //delete the member from the server's members array
        server2.members = server2.members.filter((member) => member.toString() !== memberId);

        await server2.save();

        const server3 = await Server.findById(serverId).populate('channels').populate('members');

        const server = await Server.populate(server3, {
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

        return NextResponse.json({server});
    }
    catch(error){
        console.log(error);
    }
}

