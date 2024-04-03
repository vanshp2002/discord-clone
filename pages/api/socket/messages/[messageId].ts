import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Server from "@/models/server";
import Channel from "@/models/channel";
import Message from "@/models/message";
import Member from "@/models/member";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try{
    const {userId, channelId, serverId, memberId, messageId} = req.query;
    let chamber = Member.find({_id: memberId});

    await connectMongoDB();

    const user = await User.findById({ _id: userId });
    let server = await Server.findById({ _id: serverId });

    if (!user || !server) {
      return res.status(404).json({ error: "Not found" });
    }

    let channel = await Channel.findById({ _id: channelId });
    
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    server = await Server.populate(server, [{
            path: "channels",
            model: "Channel",
        },
        {
            path: "members",
            model: "Member",
            populate: {
                path: "userId",
                model: "User",
            },
        }]
    );

    const member = server.members.find((member) => member.userId._id.toString() === user._id.toString());

    if(!member){
      return res.status(403).json({ error: "Forbidden" });
    }

    let message = await Message.findById({
        _id: messageId,
    });

    if(!message || message?.deleted) {
        return res.status(404).json({ error: "Message not found" });
    }
    

    message = await Message.populate(message, 
    {
        path: "memberId",
        model: "Member",
    });

    const isMessageOwner = message.memberId._id.toString() === member._id.toString();
    const isAdmin = member.role === "ADMIN";
    const isModerator = member.role === "MODERATOR";
    const canModify = isMessageOwner || isAdmin || isModerator;

    if(!canModify){
      return res.status(403).json({ error: "Forbidden" });
    }

    if(req.method === "DELETE"){
        message = await Message.findByIdAndUpdate(
            { _id: messageId },
            { fileUrl: null, content: "This message has been deleted.", deleted: true },
            { new: true }
        );
    }

    if(req.method === "PATCH"){
        if(!isMessageOwner) {
            return res.status(403).json({ error: "Forbidden" });
        }
        message = await Message.findByIdAndUpdate(
            { _id: messageId },
            { content: req.body.content },
            { new: true }
        );
    }

    message = await Message.populate(message, {
        path: "memberId",
        model: "Member",
        populate: {
            path: "userId",
            model: "User",
        },
    });

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}