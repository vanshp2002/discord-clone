import { NextApiResponse } from "next";
import { connectMongoDB } from "@/lib/mongodb";
import Message from "@/models/message";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
    try {
        await connectMongoDB();

        const { content, fileUrl, userId, channelId } = await req.json();

        const newMessage = new Message({
            content,
            fileUrl,
            userId: new ObjectId(userId),
            channelId: new ObjectId(channelId),
        });

        const result = await newMessage.save();

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json(error);
    }
}