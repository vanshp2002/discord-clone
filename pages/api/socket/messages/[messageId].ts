import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Server from "@/models/server";
import Channel from "@/models/channel";
import Message from "@/models/message";
import {ObjectId} from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try{
    const {userId, channelId, serverId, memberId, messageId} = req.query;

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
            { content: req.body.content, edited: true},
            { new: true }
        );
    }

    if(req.method === "POST") {
      const { task, emoji, messageId, memberId } = req.body;

      if (!task || !messageId || !memberId) {
        return res.status(400).json({ error: "Invalid input data" });
      }

      if(task === "addReaction") {

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
      }

      if(task === "removeReaction") {
        let reaction = message.reactions;

        // Check if any reaction memberId array contains the memberId
        let reactionIndex = reaction.findIndex((r) => r.memberId.find((m) => m.toString() === memberId));

        if(reactionIndex !== -1){
            reaction[reactionIndex].memberId = reaction[reactionIndex].memberId.filter((m) => m.toString() !== memberId);
        } else {
            return res.status(404).json({ error: "Reaction not found" });
        }

        message.reactions = reaction;
        message.markModified('reactions');
        await message.save();
      }

    }

    message = await Message.populate(message, [{
        path: "memberId",
        model: "Member",
        populate: {
            path: "userId",
            model: "User",
        },
    },
    {
        path: "reactions.memberId",
        model: "Member",
        populate: {
            path: "userId",
            model: "User",
        },
    }
  ]);

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}