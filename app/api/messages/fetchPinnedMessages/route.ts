import Message from '@/models/message';
import Channel from '@/models/channel';
import Conversation from '@/models/conversation';
import Member from '@/models/member';
import User from '@/models/user';
import DirectMessage from '@/models/directmessage';
import { connectMongoDB } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import {ObjectId} from 'mongodb';

export async function POST(req: NextRequest) {
    try{
        
        const {chatId, type} = await req.json();

        if(!chatId || !type){
            return new NextResponse("Invalid Request", { status: 400 });
        }

        await connectMongoDB();
        let pinnedMessages = [];

        if(type==="channel"){
            const channel = await Channel.findOne({_id: new ObjectId(chatId)});

            pinnedMessages = await Message.find({_id: {$in: channel.pinnedMessages}}).sort({createdAt: -1});

            pinnedMessages = await Member.populate(pinnedMessages, {path: "memberId", model: "Member"});

            pinnedMessages = await User.populate(pinnedMessages, {path: "memberId.userId", model: "User"});

            return NextResponse.json({pinnedMessages});
        }

        if(type==="conversation"){
            const conversation = await Conversation.findOne({_id: new ObjectId(chatId)});

            pinnedMessages = await DirectMessage.find({_id: {$in: conversation.pinnedMessages}}).sort({createdAt: -1});

            pinnedMessages = await User.populate(pinnedMessages, {path: "memberId", model: "User"});

            return NextResponse.json({pinnedMessages});
        }

        return new NextResponse("Invalid Type", { status: 500 });

    } catch (err) {
        console.error(err);
    }
}
