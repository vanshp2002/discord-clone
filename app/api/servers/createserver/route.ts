
import { v4 as uuidv4 } from "uuid";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Server from "@/models/server";
import User from "@/models/user";
import Member from '@/models/member';
import Channel from '@/models/channel';


export async function POST(req: Request) {
    try {
        const { name, imageUrl, email } = await req.json();
        console.log(req.json());
        await connectMongoDB();
        const user = await User.findOne({ email });

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const profile = user.toJSON();

        const serverDocument = {
            name,
            imageUrl,
            inviteCode: uuidv4(),
            userId: profile._id,
        };
        const result = await Server.collection.insertOne(serverDocument);


        const newChannel= new Channel({
            name: "general",
            type:"TEXT",
            userId: profile._id,
            serverId: result.insertedId
        });

        const channelResult = await newChannel.save();
        const serverUpdateResult1 = await Server.findOneAndUpdate(
            { _id: result.insertedId },
            { $push: { channels: channelResult._id } }, 
            { new: true } 
        );

        const newMember= new Member({
            role: 'ADMIN',
            userId: profile._id,
            serverId: result.insertedId
        });

        const memberResult = await newMember.save();
        const serverUpdateResult2 = await Server.findOneAndUpdate(
            { _id: result.insertedId }, 
            { $push: { members: memberResult._id } },
            { new: true } 
        );

        const serverUpdateResult3 = await Server.findOneAndUpdate(
            { _id: result.insertedId },
            { $push: { newmembers: {userId: profile._id, role: 'ADMIN'}}},
            { new: true, projection: { _id: 0 } }
        );

        return NextResponse.json({ server: result});

    } catch (error) {
        console.log("error during server POST:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}