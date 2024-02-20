
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Server from "@/models/server";
import Channel from "@/models/channel";


export async function POST(req: Request) {
   
    try{
        const { name, type, userId, serverId } = await req.json();        
        await connectMongoDB();

        const newChannel = new Channel({
            name,
            type,
            userId,
            serverId
          }); 
      
          const channelResult = await newChannel.save();
          const serverUpdateResult = await Server.findOneAndUpdate(
            { _id: serverId }, // Find the customer by their ObjectId
            { $push: { channels: channelResult._id } }, // Push the new post's _id to the posts array
            { new: true } // Return the modified customer document
        );

        console.log(serverUpdateResult);

        return NextResponse.json(channelResult);

    }catch(error){
        console.log("error during server POST:", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}