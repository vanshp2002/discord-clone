import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import Member from "@/models/member";
import { ObjectId } from "mongodb"; // Import ObjectId
import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { userId, inviteCode } = await req.json();

        // Find the server with the given invite code
        const server = await Server.findOne({ inviteCode });

        if (!server) {
            return NextResponse.json({}); // No server found with the provided invite code
        }

        // Check if the server's members array contains a member with the specified userId
        const member = await Member.findOne({ userId: new ObjectId(userId), serverId: server._id });

        if (!member) {
            return NextResponse.json({}); // Member not found in the server's members array
        }

        return NextResponse.json({ server });
    } catch (error) {
        console.error(error);
        return NextResponse.error(error);
    }
}