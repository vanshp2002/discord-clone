import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import User from "@/models/user";

import { ObjectId } from "mongodb";

export async function POST(req) {
    try{
        await connectMongoDB();
        const {serverId, name,imageUrl,email} = await req.json();

        //find userId from userr collection with email
        const user = await User.findOne({email});

        //find server with serverId and userId
        const server = await Server.findOne({_id: serverId, userId: user._id});

        if(!server){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        server.name = name;
        server.imageUrl = imageUrl;
        await server.save();
        return NextResponse.json(server);
    }
    catch(error){
        console.log(error);
    }
}

