import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import Channel from "@/models/channel";
import Member from "@/models/member";

export async function POST(req) {
    try{
        const {serverId} = await req.json();
        await connectMongoDB();
        
        const server = await Server.findById(serverId).populate('channels').populate('members');
        
        if (!server) {
            return new NextResponse("User not found", { status: 404 });
        }
        
        return NextResponse.json({server});
    }
    catch(error){
        console.log(error);
    }
}