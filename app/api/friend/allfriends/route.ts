import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import Friend from "@/models/friend";
import User from "@/models/user";


export async function POST(req) {

    try {
        await connectMongoDB();
        const { userId } = await req.json();

        const user = await User.findOne({ _id: userId });

        if (!user) return NextResponse.json({ "message": "user not found" });

        let friends = await Friend.find({
            $or: [
                { userOneId: userId },
                { userTwoId: userId }
            ]
        });

        friends = await Friend.populate(friends, { path: 'userOneId userTwoId', model: 'User'});

        return NextResponse.json({ friends });

    } catch (error) {
        console.error('Error creating/getting conversation:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}