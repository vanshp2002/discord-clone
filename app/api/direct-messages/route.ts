import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import User from "@/models/user";
import Channel from "@/models/channel";
import Member from "@/models/member";
import Message from "@/models/message";
import DirectMessage from "@/models/directmessage";

const MESSAGES_BATCH = 15;

export async function POST(req: Request) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);

        
        const {cursor, conversationId, userId} = await req.json();
        console.log(cursor, conversationId, userId)

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return new NextResponse("Unauthorized", { status: 404 });
        }

        if(!conversationId){
            return new NextResponse("Conversation not found", { status: 404 });
        }

        let messages = [];

        if(cursor) {
            messages = await DirectMessage.find({ conversationId: new ObjectId(conversationId), _id: { $lt: new ObjectId(cursor) } }).sort({ createdAt: -1 }).limit(MESSAGES_BATCH);
            messages = await DirectMessage.populate(messages, {
                path: "memberId",
                model: "Member",
                populate: {
                    path: "userId",
                    model: "User"
                }
            });
            console.log("[DIRECT_MESSAGES_GET]",messages);
        } else {
            messages = await Message.find({ conversationId: new ObjectId(conversationId) }).sort({ createdAt: -1 }).limit(MESSAGES_BATCH);
            messages = await Message.populate(messages, {
                path: "memberId",
                model: "Member",
                populate: {
                    path: "userId",
                    model: "User"
                }
            });
        }

        let nextCursor = null;
        if(messages.length === MESSAGES_BATCH){
            nextCursor = messages[MESSAGES_BATCH - 1]._id;
        }

        return NextResponse.json({ items: messages, nextCursor });
    }catch(err){
        console.log("[DIRECT_MESSAGES_GET]",err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}