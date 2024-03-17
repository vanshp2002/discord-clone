
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Server from "@/models/server";
import Channel from "@/models/channel";


export async function POST(req: Request) {
   
    try{
        const { name, type, userId, serverId } = await req.json();        
        await connectMongoDB();
        if(name === "general"){
            return NextResponse.json({"error":"Channel name cannot be 'general'"});
        }
        const newChannel = new Channel({
            name,
            type,
            userId,
            serverId
          }); 
      
          const channelResult = await newChannel.save();
          const serverUpdateResult = await Server.findOneAndUpdate(
            { _id: serverId }, 
            { $push: { channels: channelResult._id } }, 
            { new: true }
        );

        console.log(serverUpdateResult);

        return NextResponse.json(channelResult);

    }catch(error){
        console.log("error during server POST:", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}