import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import Message from "@/models/message";
import User from "@/models/user";
import Poll from "@/models/poll";
import Server from "@/models/server";
import { connectMongoDB } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
    }
    try{
        await connectMongoDB();
        const { channelId, serverId, userId } = req.query;
        const { question, options, allowMultiple } = req.body;

        if (!channelId || !serverId || !userId || !question) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const optionsArray = [];

        for (const option of options) {
            optionsArray.push({ option: option, voters:[] });
        }

        const newPoll = new Poll({
            question,
            options: optionsArray,
            allowMultiple,
        });

        const poll = await newPoll.save();

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

        const member = server.members.find(member => member.userId._id.toString() === userId);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        const newMessageData = {
            content: "Poll",
            channelId,
            memberId: member._id,
            pollId: poll._id
        };

        const message = await Message.create(newMessageData);

        const populatedMessage = await Message.populate(message, [{
            path: "memberId",
            model: "Member",
            populate: {
                path: "userId",
                model: "User"
            }
        },
        {
            path: "pollId",
            model: "Poll"
        }
    ]);


        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, populatedMessage);

        return res.status(200).json(populatedMessage);

    }
    catch(err){
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
}