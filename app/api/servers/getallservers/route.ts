import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Server from "@/models/server";
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try{
        await connectMongoDB();
        const {userId} = await req.json();
        const server = await Server.find({userId});
        return NextResponse.json({server});
    }
    catch(error){
        console.log(error);
    }
}