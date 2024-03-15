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
            return new NextResponse("Server not found", { status: 404 });
        }

        const newMem = {
            userId: new ObjectId(userId),
            role: "GUEST",
        };
        
        const newMember = new Member({ userId: new ObjectId(userId), role: 'GUEST', serverId: server._id });


        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // Check if the server's members array contains a member with the specified userId
            const foundMember = await server.newmembers.find((member) => member.userId.toString() === userId);
            if (foundMember) {
                await session.commitTransaction();
                session.endSession();
                return NextResponse.json({ server });
            }

            // Create a new member with the given userId and 'GUEST' role
            //Check if userId and serverId exists in members collection
            const member = await Member.findOne({ userId: new ObjectId(userId), serverId: server._id });
            if (member) {
                await session.commitTransaction();
                session.endSession();
                return NextResponse.json({ server });
            }
            await newMember.save();

            // Add the new member to the server's members array
            server.members.push(newMember._id);

            server.newmembers.push(newMem);
            await server.save({ session });

            await session.commitTransaction();
            session.endSession();
            return NextResponse.json({ server });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        console.error(error);
        return NextResponse.error(error);
    }
}