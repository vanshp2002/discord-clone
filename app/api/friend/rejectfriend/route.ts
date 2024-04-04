import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Friend from "@/models/friend";

export async function POST(req) {
    try{
        await connectMongoDB();
        const { friendId } = await req.json();
        const friend = await Friend.findOneAndDelete(
            { _id: new ObjectId(friendId) }
        );
        return NextResponse.json({ friend });
    }
    catch(err){
        console.log(err);
    }
}