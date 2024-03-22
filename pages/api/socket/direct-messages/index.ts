import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import Channel from "@/models/channel";
import DirectMessage from "@/models/directmessage";
import Member from "@/models/member";
import User from "@/models/user";
import Server from "@/models/server";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Conversation from "@/models/conversation";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
    }
    try{
        await connectMongoDB();
        const { conversationId, userId } = req.query;
        const { content, fileUrl } = req.body;

        

        if(!userId) {
            return res.status(400).json({ message: "Unauthorized" });
        }

        if(!content){
            return res.status(400).json({ message: "Content is required" });
        }

        const user = await User.findOne({ _id: userId});
        
        let conversation = await Conversation.findOne({_id: conversationId});

        if(!conversation){
            return res.status(400).json({ message: "conversation is required" });
        }

        let message = new DirectMessage({
            content,
            fileUrl,
            memberId: new ObjectId(userId),
            conversationId,
        });
        await message.save();
        console.log("||||||||||||||||||||||||||||||||||||||||   ")        
        console.log(message);   
        console.log("||||||||||||||||||||||||||||||||||||||||")

        const conversationUpdated = await Conversation.findOneAndUpdate(
            { _id: conversationId }, 
            { $push: { directMessages: message._id } }, 
            { new: true }
        );

        message = await DirectMessage.populate(message, [
            {
                path: "memberId",
                model: "User",
            },
            {
                path: "conversationId",
                model: "Conversation",
            },
        ]);

        const channelKey = `chat:${conversationId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);

    }
    catch(err){
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
}