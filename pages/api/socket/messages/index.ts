import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import Channel from "@/models/channel";
import Message from "@/models/message";
import Member from "@/models/member";
import User from "@/models/user";
import Server from "@/models/server";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Poll from "@/models/poll";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    try {
        await connectMongoDB();
        const { channelId, serverId, userId, replyId, replyExist, replyContent, replyName, replyImg } = req.query;
        const { content, fileUrl } = req.body;

        if (!channelId) {
            return res.status(400).json({ message: "Channel ID not found" });
        }

        if (!serverId) {
            return res.status(400).json({ message: "Server ID not found" });
        }

        if (!userId) {
            return res.status(400).json({ message: "Unauthorized" });
        }

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const poll = await Poll.findById(null);

        const user = await User.findOne({ _id: userId });
        let server = await Server.findOne({ _id: serverId });

        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        server = await Server.populate(server, [
            {
                path: "members",
                model: "Member",
                populate: {
                    path: "userId",
                    model: "User"
                }
            },
            {
                path: "channels",
                model: "Channel"
            }
        ]);

        const channel = await Channel.findOne({ _id: channelId, serverId: serverId });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const member2 = await Member.find({ channelId, serverId })
        const member = server.members.find((member) => member.userId._id.toString() === userId);

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        let message;

        if (replyExist) {
            message = new Message({
                content,
                replyId: new ObjectId(replyId),
                replyExist: true,
                replyContent,
                replyName,
                replyImg,
                fileUrl,
                channelId,
                memberId: member._id,
            });
        }
        else {
            message = new Message({
                content,
                fileUrl,
                channelId,
                memberId: member._id,
            });
        }

        await message.save();

        message = await Message.populate(message, [{
            path: "memberId",
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

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}