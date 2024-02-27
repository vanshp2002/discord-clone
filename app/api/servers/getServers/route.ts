import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
    try{
        await connectMongoDB();
        const {userId} = await req.json();
        const user = new ObjectId(userId);
        const foundServers = await Server.collection.find({
            userId: user
        }).toArray();
        return NextResponse.json({foundServers});
    }
    catch(error){
        console.log(error);
    }
}