import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Conversation from "@/models/conversation";
import Member from "@/models/member";
import { ObjectId } from "mongodb"; // Import ObjectId

export async function POST(req) {
    try {
        await connectMongoDB();
        
        const { memberOneId, memberTwoId } = await req.json();

        const member1 = await Member.findById(memberOneId);
        const member2 = await Member.findById(memberTwoId);

        let conversation = await Conversation.create(
            {memberOneId: new ObjectId(member1.userId), memberTwoId: new ObjectId(member2.userId)},
        );

        conversation = await Conversation.populate(conversation, [
            {
                path: 'memberOneId',
                model: 'User'
            },
            {
                path: 'memberTwoId',
                model: 'User'
            }
        ]);

        return NextResponse.json(conversation);
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(error);
    }
}