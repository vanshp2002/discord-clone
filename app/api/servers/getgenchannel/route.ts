
import { v4 as uuidv4 } from "uuid";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Server from "@/models/server";
import User from "@/models/user";
import Member from '@/models/member';
import Channel from '@/models/channel';
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    try {
        const { serverId } = await req.json();

        const channel = await Channel.findOne({serverId: new ObjectId(serverId), name: "general" });

        if (!channel) {
            return NextResponse.json({ "error": "Channel not found" });
        }

        return NextResponse.json({ channel });

    } catch (error) {
        console.log("error during server POST:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}