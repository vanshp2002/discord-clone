import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Conversation from "@/models/conversation";
import { ObjectId } from "mongodb"; // Import ObjectId
import { oboolean } from "zod";

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
                model: 'Member',
                populate: {
                    path: 'userId', 
                    model: 'User'
                }
            },
            {
                path: 'memberTwoId',
                model: 'Member',
                populate: {
                    path: 'userId',
                    model: 'User'
                }
            }
        ]);
    

        return NextResponse.json(conversation);
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(error);
    }
}
