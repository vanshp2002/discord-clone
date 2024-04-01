import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import Channel from "@/models/channel";
import Message from "@/models/message";
import User from "@/models/user";
import Conversation from "@/models/conversation";
import DirectMessage from "@/models/directmessage";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
    }
    try{
        await connectMongoDB();
        const { conversationId, userId, otherUserId } = req.query;
        const { content, fileUrl, replyMessage } = req.body;

        if (!content || !conversationId || !userId || !otherUserId) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const user = await User.findOne({ _id: new ObjectId(userId) });

        const newMessageData = {
            content,
            fileUrl,
            conversationId,
            memberId: new ObjectId(userId),
        };

        if (replyMessage) {
            newMessageData.reply = replyMessage;
            newMessageData.replyExist = true;
        }

        let message = await DirectMessage.create(newMessageData);

        const conversationUpdated = await Conversation.findOneAndUpdate(
            { _id: conversationId }, 
            { $push: { directMessages: message._id } }, 
            { new: true }
        );

        message = await DirectMessage.populate(message, [
            {
                path: "memberId",
                model: "User",
            }
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