import { NextApiResponse } from "next";
import { connectMongoDB } from "@/lib/mongodb";
import DirectMessage from "@/models/directmessage";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
    try {
        await connectMongoDB();

        const { content, fileUrl, memberId, conversationId } = await req.json();

        const newMessage = new DirectMessage({
            content,
            fileUrl,
            memberId: new ObjectId(memberId),
            conversationId: new ObjectId(conversationId),
        });

        const result = await newMessage.save();

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json(error);
    }
}