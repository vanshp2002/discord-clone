
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import Server from "@/models/server";
import Member from "@/models/member";


export async function POST(req: NextRequest) {

    try {
        const { role, userId, serverId } = await req.json();
        await connectMongoDB();

        const newMember = new Channel({
            userId,
            serverId
        });

        const memberResult = await newMember.save();
        const serverUpdateResult = await Server.findOneAndUpdate(
            { _id: serverId },
            { $push: { members: memberResult._id } },
            { new: true }
        );


        return NextResponse.json(channelResult);

    } catch (error) {
        console.log("error during server POST:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}