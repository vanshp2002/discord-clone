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
            return NextResponse.error(new Error("Server not found with the provided invite code"));
        }

        // Create a new member with the given userId and 'GUEST' role
        const newMember = new Member({ userId: new ObjectId(userId), role: 'GUEST', serverId: server._id });
        await newMember.save();

        // Add the new member to the server's members array
        server.members.push(newMember._id);
        await server.save();

        // Populate server with its members and channels before returning
        // await server.populate('members').populate('channels').execPopulate();

        return NextResponse.json({ server });
    } catch (error) {
        console.error(error);
        return NextResponse.error(error);
    }
}
