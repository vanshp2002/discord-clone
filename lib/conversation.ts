import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import Conversation from "@/models/conversation";

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        // Attempt to find an existing conversation first
        let conversation = await Conversation.findOne({
          $or: [
            { memberOneId: memberOneId, memberTwoId: memberTwoId },
            { memberOneId: memberTwoId, memberTwoId: memberOneId }
          ]
        });
    
        // If the conversation doesn't exist, create it
        if (!conversation) {
          conversation = new Conversation({
            memberOneId,
            memberTwoId,
            directMessages: [] // Initialize an empty array for direct messages
          });
          await conversation.save();
        }
    
        // Populate the member information, including the linked user info
        // Note: No need to call execPopulate() for newer Mongoose versions
        conversation = await Conversation.findById(conversation._id)
          .populate({
            path: 'memberOneId memberTwoId',
            populate: {
              path: 'userId',
              model: 'User' // Adjust according to your User model name
            }
          });
    
        NextResponse.json({conversation});
      } catch (error) {
        console.error('Error creating/getting conversation:', error);
        NextResponse.json({ message: 'Internal server error' });
      }
}