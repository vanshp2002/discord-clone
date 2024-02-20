import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";


export async function POST(req) {
    try{
        const {serverId} = await req.json();
        await connectMongoDB();
        console.log(serverId);
        
        const server = await Server.findById(serverId).populate('channels').populate('members');
        console.log(server);
        
        if (!server) {
            return new NextResponse("User not found", { status: 404 });
        }
        console.log("HI");
        
        return NextResponse.json({server});
    }
    catch(error){
        console.log(error);
    }
}