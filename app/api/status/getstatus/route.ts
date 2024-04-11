import { connectMongoDB } from "@/lib/mongodb";
import Status from "@/models/status";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import {ObjectId} from "mongodb";

export async function POST(req) {
    try{
        await connectMongoDB();
        const {userId} = await req.json();

        // const status = await Status.findOne({userId: new ObjectId(userId)}); 
        const status = await Status.find({userId: new ObjectId(userId)}); 

        return NextResponse.json({status});
    }
    catch (error) {
        console.error("Error getting status", error);
        return NextResponse.json({message: "Error getting status"});
    }
}