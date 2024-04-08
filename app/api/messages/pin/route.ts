import Message from '@/models/message';
import Channel from '@/models/channel';
import Conversation from '@/models/conversation';
import DirectMessage from '@/models/directmessage';
import { connectMongoDB } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import {ObjectId} from 'mongodb';

export async function POST(req: NextRequest) {
    try{
        await connectMongoDB();

        const {chatId, messageId, type} = await req.json();

        if(!chatId || !messageId || !type){
            return new NextResponse("Invalid Request", { status: 400 });
        }


        if(type==="channel"){
            const message = await Message.findOneAndUpdate({_id: new ObjectId(messageId)}, {pinned: true}, {new: true});
            const channel = await Channel.findOneAndUpdate({_id: new ObjectId(chatId)}, {$push: {pinnedMessages: message._id}}, {new: true});
            return NextResponse.json({channel});
        }

        if(type==="conversation"){
            const message = await DirectMessage.findOneAndUpdate({_id: new ObjectId(messageId)}, {pinned: true}, {new: true});
            const conversation = await Conversation.findOneAndUpdate({_id: new ObjectId(chatId)}, {$push: {pinnedMessages: message._id}}, {new: true});
            return NextResponse.json({conversation});
        }

        return new NextResponse("Invalid Type", { status: 500 });
    } catch (err) {
        console.error(err);
    }
}