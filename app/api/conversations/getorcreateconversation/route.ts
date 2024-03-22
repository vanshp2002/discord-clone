import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import Conversation from "@/models/conversation";
import Member from "@/models/member";
import User from "@/models/user";


export async function POST(req: Request){

try {
    await connectMongoDB();
    const{memberOneId, memberTwoId} = await req.json();

    const member1 = await Member.findOne({_id: memberOneId});   
    const member2 = await Member.findOne({_id: memberTwoId});   

    
    let conversation = await Conversation.findOne({
      $or: [
        { memberOneId: member1.userId, memberTwoId: member2.userId },
        { memberOneId: member2.userId, memberTwoId: member1.userId }
      ]
    });



    // If the conversation doesn't exist, create it
    if (!conversation) {
      conversation = new Conversation({
        memberOneId: member1.userId, 
        memberTwoId: member2.userId,
        directMessages: [] // Initialize an empty array for direct messages
      });
      await conversation.save();
    }

    // Populate the member information, including the linked user info
    // Note: No need to call execPopulate() for newer Mongoose versions
    conversation = await Conversation.findById(conversation._id)
      .populate({
        path: 'memberOneId memberTwoId',
        model: 'User'
      });

    return NextResponse.json({conversation});
  } catch (error) {
    console.error('Error creating/getting conversation:', error);
    return NextResponse.json({ message: 'Internal server error' });
  }
}