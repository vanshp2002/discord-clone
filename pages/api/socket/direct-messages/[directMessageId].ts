import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Server from "@/models/server";
import Channel from "@/models/channel";
import Message from "@/models/message";
import DirectMessage from "@/models/directmessage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try{
    const {conversationId, userId, directmessageId} = req.query;

    await connectMongoDB();

    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "Not found" });
    }

    let message = await DirectMessage.findById({
        _id: directmessageId,
    });

    if(!message || message?.deleted) {
        return res.status(404).json({ error: "Message not found" });
    }

    message = await DirectMessage.populate(message, 
    {
        path: "memberId",
        model: "User",
    });

    const isMessageOwner = message.memberId._id.toString() === user._id.toString();
    const canModify = isMessageOwner;

    if(!canModify){
      return res.status(403).json({ error: "Forbidden" });
    }

    if(req.method === "DELETE"){
        message = await DirectMessage.findByIdAndUpdate(
            { _id: directmessageId },
            { fileUrl: null, content: "This message has been deleted.", deleted: true },
            { new: true }
        );
    }

    if(req.method === "PATCH"){
        if(!isMessageOwner) {
            return res.status(403).json({ error: "Forbidden" });
        }
        message = await DirectMessage.findByIdAndUpdate(
            { _id: directmessageId },
            { content: req.body.content },
            { new: true }
        );
    }

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

    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}