import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
    try{
        await connectMongoDB();
        const {profileId} = await req.json();
        const profile = new ObjectId(profileId);
        const server = await Server.collection.findOne({
            userId: profile
        });
        // console.log(server);
        return NextResponse.json({server});
    }
    catch(error){
        console.log(error);
    }
}