import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";

import { ObjectId } from "mongodb";


export async function POST(req) {
    try{
        const {serverId} = await req.json();
        await connectMongoDB();
        // console.log(serverId);
        
        const server2 = await Server.findById(serverId).populate('channels').populate('members');
        
        // i now want to populate the populated members having userId with user profile
        
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
            return new NextResponse("User not found", { status: 404 });
        }
        
        return NextResponse.json({server});
    }
    catch(error){
        console.log(error);
    }
}