import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import Member from "@/models/member";

import { ObjectId } from "mongodb";

export async function POST(req) {
    try{
        const {serverId, memberId, userId, role} = await req.json();
        await connectMongoDB();
        
        //find the member in members collection by userId and serverId and update the role
        const member = await Member.findOneAndUpdate({_id: memberId}, {role}, {new: true});

        let server2 = await Server.findById(serverId);
        let newmembers = server2.newmembers;
        newmembers = newmembers.map((newmember) => {
            if(newmember.userId.toString() === userId.toString()){
                newmember.role = role;
            }
            return newmember;
        });
        server2.newmembers = newmembers;
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