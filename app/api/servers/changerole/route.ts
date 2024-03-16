import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Member from "@/models/member";
import Server from "@/models/server";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        const {serverId, memberId, role } = await req.json();

        const updatedMember = await Member.findByIdAndUpdate(new ObjectId(memberId), { role }, { new: true });

        if (!updatedMember) {
            return NextResponse.json({"error":"Member not found"});
        }

        const server = await Server.findById(serverId).populate('channels').populate('members');
        console.log(server);
        
        if (!server) {
            return new NextResponse("User not found", { status: 404 });
        }
        
        return NextResponse.json({server});

    } catch (error) {
        console.error(error);
        return NextResponse.error(error);
    }
}
