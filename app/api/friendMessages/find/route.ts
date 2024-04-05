import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Conversation from "@/models/conversation";
import { ObjectId } from "mongodb"; // Import ObjectId
import Member from "@/models/member";

export async function POST(req) {
    try {
        await connectMongoDB();
        
        const { memberOneId, memberTwoId } = await req.json();

        let conversation = await Conversation.findOne(
            {memberOneId: new ObjectId(memberOneId), memberTwoId: new ObjectId(memberTwoId)},
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
