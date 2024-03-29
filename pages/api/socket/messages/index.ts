import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import Channel from "@/models/channel";
import Message from "@/models/message";
import User from "@/models/user";
import Server from "@/models/server";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
    }
    try{
        await connectMongoDB();
        const { channelId, serverId, userId } = req.query;
        const { content, fileUrl, replyMessage } = req.body;

        if (!channelId || !serverId || !userId || !content) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const server = await Server.findById(serverId).populate({
            path: "members",
            populate: {
                path: "userId",
                model: "User"
            }
        });

        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        const channel = await Channel.findOne({ _id: channelId, serverId: serverId });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const member = server.members.find(member => member.userId._id.toString() === userId);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        const newMessageData = {
            content,
            fileUrl,
            channelId,
            memberId: member._id
        };

        if (replyMessage) {
            newMessageData.reply = replyMessage;
            newMessageData.replyExist = true;
        }

        const message = await Message.create(newMessageData);

        const populatedMessage = await Message.populate(message, {
            path: "memberId",
            populate: {
                path: "userId",
                model: "User"
            }
        });

        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, populatedMessage);

        return res.status(200).json(populatedMessage);

    }
    catch(err){
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
}