import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import Member from "@/models/member";
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        await connectMongoDB();
        const { userId } = await req.json();
        const userMemberships = await Member.find({ userId });

        const serverIds = userMemberships.map(member => member.serverId);

        const servers = await Server.find({ _id: { $in: serverIds } });
        return NextResponse.json({ servers });
    }
    catch (error) {
        console.log(error);
    }
}