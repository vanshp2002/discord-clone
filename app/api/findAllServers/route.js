import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";

export async function POST(req) {
    try{
        await connectMongoDB();
        const {profileId} = await req.json();
        console.log(profileId);
        const foundServers = await Server.collection.find({
            "members.profileId": profileId
        }).toArray();
        // console.log(foundServers);
        return NextResponse.json({foundServers});
    }
    catch(error){
        console.log(error);
    }
}