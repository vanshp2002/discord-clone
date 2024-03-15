import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { ObjectId } from "mongodb";

export async function POST(req) {
    await connectMongoDB();
    const { userId, displayname, imageUrl } = await req.json();
    let imageUrltemp = imageUrl;
    if(!imageUrl){
        imageUrltemp = "https://utfs.io/f/0861b5a9-d246-42b0-bdcb-ab8cbb6d2cea-g7cq2y.png";
    }
    const user = await User.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { displayname, imageUrl: imageUrltemp },
        { new: true }
    );

    return NextResponse.json({ user });
}
