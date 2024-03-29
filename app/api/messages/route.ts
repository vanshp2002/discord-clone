import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import User from "@/models/user";
import Channel from "@/models/channel";
import Member from "@/models/member";
import Message from "@/models/message";

const MESSAGES_BATCH = 15;

export async function POST(req: Request) {

    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        // let cursor = searchParams.get("cursor");
        // const channelId = searchParams.get("channelId");

        
        const {cursor, channelId, userId} = await req.json();

        // const userId = searchParams.get("userId");

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return new NextResponse("Unauthorized", { status: 404 });
        }

        if(!channelId){
            return new NextResponse("Channel not found", { status: 404 });
        }

        let messages = [];

        if(cursor) {
            messages = await Message.find({ channelId: new ObjectId(channelId), _id: { $lt: new ObjectId(cursor) } }).sort({ createdAt: -1 }).limit(MESSAGES_BATCH);
            messages = await Message.populate(messages, [{
                path: "memberId",
                model: "Member",
                populate: {
                    path: "userId",
                    model: "User"
                }
            },
            {
                path: "reactions.memberId",
                model: "Member",
                populate: {
                    path: "userId",
                    model: "User"
                }
            },
            // {
            //     path: "reply",
            //     model: "Message",
            // },
            // {
            //     path: "replyTo",
            //     model: "User"
            // }
        ]);
        } else {
            messages = await Message.find({ channelId: new ObjectId(channelId) }).sort({ createdAt: -1 }).limit(MESSAGES_BATCH);
            messages = await Message.populate(messages, [{
                path: "memberId",
                model: "Member",
                populate: {
                    path: "userId",
                    model: "User"
                }
            },
            {
                path: "reactions.memberId",
                model: "Member",
                populate: {
                    path: "userId",
                    model: "User"
                }
            },
            // {
            //     path: "reply",
            //     model: "Message",
            // },
            // {
            //     path: "replyTo",
            //     model: "User"
            // }
        ]);
        }

        let nextCursor = null;
        if(messages.length === MESSAGES_BATCH){
            nextCursor = messages[MESSAGES_BATCH - 1]._id;
        }

        return NextResponse.json({ items: messages, nextCursor });
    }catch(err){
        console.log("[MESSAGES_GET]",err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}
