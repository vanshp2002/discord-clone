import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import User from "@/models/user";
import Channel from "@/models/channel";
import Member from "@/models/member";
import Message from "@/models/message";

export async function POST(req) {
    try{

        await connectMongoDB();
        const { messageId, emoji, memberId } = await req.json();

        let message = await Message.findOne({ _id: new ObjectId(messageId) });

        if(!message){
            return new NextResponse("Message not found", { status: 404 });
        }

        let reaction = message.reactions;

        // Check if any reaction memberId array contains the memberId
        let reactionIndex = reaction.findIndex((r) => r.memberId.find((m) => m.toString() === memberId));

        if(reactionIndex !== -1){
            reaction[reactionIndex].memberId = reaction[reactionIndex].memberId.filter((m) => m.toString() !== memberId);
        } 

        // Check if the emoji already exists
        let emojiIndex = reaction.findIndex((r) => r.emoji === emoji);
        if(emojiIndex !== -1){
            reaction[emojiIndex].memberId.push(new ObjectId(memberId));
        }
        else {
            reaction.push({
                emoji,
                memberId: [new ObjectId(memberId)]
            });
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