import { connectMongoDB } from "@/lib/mongodb";
import Status from "@/models/status";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import {ObjectId} from "mongodb";

export async function POST(req) {
    try{
        await connectMongoDB();
        const {userId, fileUrl} = await req.json();

        console.log(userId, fileUrl);

        const status = new Status({
            userId: new ObjectId(userId),
            src: fileUrl,
        });

        await status.save();

        return NextResponse.json({message: "Status uploaded successfully"});
    } catch (error) {
        console.error("Error uploading status", error);
        return NextResponse.json({message: "Error uploading status"});
    }
}

