import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Member from "@/models/member";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        
        // Extract member IDs from the request body
        const { members } = await req.json();

        // Find members with the provided member IDs

        // Populate user details for each member
        const populatedMembers = await Member.populate(members, { path: 'userId', model: User });
        
        return NextResponse.json({ members: populatedMembers });
    } catch (error) {
        console.error(error);
        return NextResponse.error(error);
    }
}
