import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { ObjectId } from "mongodb";

export async function POST(req) {
    await connectMongoDB();
    const { userId, displayname, imageUrl } = await req.json();
    let user = null
    if(!imageUrl){
        user = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { displayname },
            { new: true }
        );
    }
    else{
        user = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { displayname, imageUrl },
            { new: true }
        );
    }

    return NextResponse.json({ user });
}