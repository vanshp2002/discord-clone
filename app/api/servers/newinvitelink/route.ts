import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import { ObjectId } from "mongodb"; 
import next from "next";


export async function POST(req) {
    try{
        await connectMongoDB();
        const {serverId} = await req.json();
        const objectId = new ObjectId(serverId);
        const newLink = uuidv4();
        const server3 = await Server.updateOne(
            { _id: objectId },
            { $set: { inviteCode: newLink} },
            {new: true}
        );
        
        const updatedServer = await Server.findOne({_id: objectId});

        if (!server3) {
            return NextResponse.json({status: 404, message: "Server not found"});
        }
        
        const server2 = await Server.findById(serverId).populate('channels').populate('members');
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
        
        return NextResponse.json(server);

    }
    catch(error){
        console.log(error);
    }
}