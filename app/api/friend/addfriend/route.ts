import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import Friend from "@/models/friend";
import User from "@/models/user";


export async function POST(req: Request) {

    try {
        await connectMongoDB();
        const { userOneId, userTwoName } = await req.json();
        const user = await User.findOne({ username: userTwoName });
        if (!user) return NextResponse.json({ "message": `Username @${userTwoName} not found.`, "status": "404" });
        const userTwoId = await user._id;
        if(userOneId === userTwoId.toString()) return NextResponse.json({ "message": `You cannot add yourself as a friend.`, "status": "404" });
        let friendship = await Friend.findOne({
            $or: [
                { userOneId, userTwoId },
                { userOneId: userTwoId, userTwoId: userOneId }
            ]
        });

        if (!friendship) {
            friendship = new Friend({
                userOneId,
                userTwoId,
            });
            await friendship.save();
            return NextResponse.json({ "message": `Request successfully sent to @${userTwoName}.`, "username": userTwoName });
        }
        if (friendship.status === "ACCEPTED") {
            return NextResponse.json({ "message": `@${userTwoName} is already a friend.`, "username": userTwoName });
        }
        return NextResponse.json({ "message": `Request to @${userTwoName} is already pending.`, "username": userTwoName });

    } catch (error) {
        console.error('Error creating/getting conversation:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}