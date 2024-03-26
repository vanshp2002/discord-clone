import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import User from "@/models/user";
import Channel from "@/models/channel";
import Member from "@/models/member";
import Message from "@/models/message";

export async function POST(req: Request) {
    try{

        await connectMongoDB();
        const { messageId, memberId } = await req.json();

        let message = await Message.findOne({ _id: new ObjectId(messageId) });

        if(!message){
            return new NextResponse("Message not found", { status: 404 });
        }

        let reaction = message.reactions;

        // Check if any reaction memberId array contains the memberId
        let reactionIndex = reaction.findIndex((r) => r.memberId.find((m) => m.toString() === memberId));

        if(reactionIndex !== -1){
            reaction[reactionIndex].memberId = reaction[reactionIndex].memberId.filter((m) => m.toString() !== memberId);
        } else {
            return new NextResponse("Reaction not found", { status: 404 });
        }

        message.reactions = reaction;
        message.markModified('reactions');
        await message.save();

        message = await Message.populate(message, {
            path: "reactions.memberId",
            model: "Member",
            populate: {
                path: "userId",
                model: "User"
            }
        });

        const reactions = message.reactions;

        return NextResponse.json({ reactions});

    } catch (err) {
        console.log(err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}