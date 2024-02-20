import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";

export async function POST(req: Request) {
    try{
        await connectMongoDB();
        const {profileId} = await req.json();
        const server = await Server.collection.findOne({
            profileId: profileId
        });
        return NextResponse.json({server});
    }
    catch(error){
        console.log(error);
    }
}