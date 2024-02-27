
import {v4 as uuidv4} from "uuid";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Server from "@/models/server";
import User from "@/models/user";


export async function POST(req: Request) {
    console.log("Hi");
    try{
        const {name, imageUrl, email} = await req.json();

        await connectMongoDB();
        const user = await User.findOne({ email });

        if (!user) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const profile = user.toJSON();
        

        const serverDocument = {
            name,
            imageUrl,
            inviteCode: uuidv4(),
            profileId: profile._id.toString(),
            channels: [
              { name: "general", profileId: profile._id.toString() }
            ],
            members: [
              { profileId: profile._id.toString(), role: "ADMIN" }
            ]
          };
      
          const result = await Server.collection.insertOne(serverDocument);

          return NextResponse.json({result});

    }catch(error){
        console.log("error during server POST:", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}