import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import DirectMessage from "@/models/directmessage";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try{
    const {conversationId, userId, directMessageId} = req.query;

    await connectMongoDB();

    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "Not found" });
    }

    if(!conversationId) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    let message = await DirectMessage.findById({
        _id: directMessageId,
    });

    if(!message || message?.deleted) {
        return res.status(404).json({ error: "Message not found" });
    }

    

    const isMessageOwner = message.memberId.toString() === userId;

    if(req.method === "DELETE"){
        message = await DirectMessage.findByIdAndUpdate(
            { _id: directMessageId },
            { fileUrl: null, content: "This message has been deleted.", deleted: true },
            { new: true }
        );
    }

    if(req.method === "PATCH"){
        if(!isMessageOwner) {
            return res.status(403).json({ error: "Forbidden" });
        }
        message = await DirectMessage.findByIdAndUpdate(
            { _id: directMessageId },
            { content: req.body.content, edited: true},
            { new: true }
        );
    }

    if(req.method === "POST") {
      const { task, emoji, messageId, memberId } = req.body;

      if (!task || !emoji || !messageId || !memberId) {
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

    message = await DirectMessage.populate(message, [
      {
          path: "memberId",
          model: "User",
      },
      {
          path: "reactions.memberId",
          model: "User",
      }
    ]);

    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}