import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Server from "@/models/server";
import Channel from "@/models/channel";
import Message from "@/models/message";
import { ObjectId } from "mongodb";
import Poll from "@/models/poll";
import Member from "@/models/member";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { userId, channelId, serverId, messageId } = req.query;

        await connectMongoDB();

        const { task, option, memberId } = req.body;

        let message = await Message.findById({
            _id: messageId,
        });
        const member = await Member.findOne({ _id: null });
        const user = await User.findOne({ _id: null });

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        let poll = await Poll.findById({
            _id: message.pollId,
        });

        if (!task || !option || !memberId) {
            return res.status(700).json({ error: "Task or option not provided" });
        }

        let options = poll.options;

        if (task === "vote") {
            if (poll.allowMultiple) {
                const index = options.findIndex((opt: any) => opt.option === option);
                options[index].voters.push(memberId);
            }
            else {

                let optionIndex = options.findIndex((opt: any) => opt.voters.find((voter: any) => voter.toString() === memberId));
                if (optionIndex !== -1) {
                    options[optionIndex].voters = options[optionIndex].voters.filter((voter: any) => voter.toString() !== memberId);
                }

                const index = options.findIndex((opt: any) => opt.option === option);
                options[index].voters.push(new ObjectId(memberId));
            }

            poll.options = options;
            poll.markModified("options");
            await poll.save();

        }


        if (task === "unvote") {
            const index = options.findIndex((opt: any) => opt.option === option);
            options[index].voters = options[index].voters.filter((voter: any) => voter.toString() !== memberId);
            poll.options = options;
            poll.markModified("options");
            await poll.save();
        }

        message = await Message.populate(message, [{
            path: "memberId",
            model: "Member",
            populate: {
                path: "userId",
                model: "User"
            }
        },
        {
            path: "pollId",
            model: "Poll",
            populate: {
                path: "options.voters",
                model: "Member",
                populate: {
                    path: "userId",
                    model: "User"
                }
            }
        }
        ]);

        const updateKey = `chat:${channelId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, message);

        return res.status(200).json(message);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }

}