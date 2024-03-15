import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import Member from "@/models/member";
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try{
        await connectMongoDB();
        const {userId} = await req.json();
        const user = new ObjectId(userId);
        
        // find servers having user as userId in newmembers array
        const foundServers = await Server.find({newmembers: {$elemMatch: {userId: user}}});

        return NextResponse.json({foundServers});
    }
    catch(error){
        console.log(error);
    }
}