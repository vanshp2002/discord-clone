import Server from "@/models/server";
import Channel from "@/models/channel";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "http2";

export async function POST(req: NextRequest) {
    try{

        await connectMongoDB();
        const {serverId} = await req.json();

        const channel = await Channel.findOne({serverId: new ObjectId(serverId), name: "general"});

        if(!channel) {
            return new NextResponse("Internal Server Error", { status: 404 });
        }

        return NextResponse.json({general: channel});

    } catch(err) {
        console.log(err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}