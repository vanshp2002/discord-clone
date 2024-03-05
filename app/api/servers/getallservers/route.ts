import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import Member from "@/models/member";
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try{
        await connectMongoDB();
        const {userId} = await req.json();
        const userMemberships = await Member.find({ userId });

        // Extract server IDs from user memberships
        const serverIds = userMemberships.map(member => member.serverId);

        // Find all servers where the current user is a member
        const servers = await Server.find({ _id: { $in: serverIds } });
        console.log("_-------------------------------------------------------------------------------");
        console.log({servers});
        console.log("_-------------------------------------------------------------------------------");

        return NextResponse.json({ servers });
    }
    catch(error){
        console.log(error);
    }
}