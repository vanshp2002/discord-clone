import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import Friend from "@/models/friend";
import User from "@/models/user";


export async function POST(req: Request) {

    try {
        await connectMongoDB();
        const { userOneId, userTwoName } = await req.json();
        const user = await User.findOne({ username: userTwoName });
        if (!user) return NextResponse.json({ "message": "user not found" });
        const userTwoId = await user._id;
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
            return NextResponse.json({ "message": "Request Send" });
        }
        if (friendship.status === "ACCEPTED") {
            return NextResponse.json({ "message": "Already a friend" });
        }
        return NextResponse.json({ "message": "Pending" });

    } catch (error) {
        console.error('Error creating/getting conversation:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}