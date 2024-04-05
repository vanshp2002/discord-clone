import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId
import Friend from "@/models/friend";

export async function POST(req: NextRequest) {

    try {
        await connectMongoDB();

        const { userOneId, userTwoId } = await req.json();

        let friendsUser1 = await Friend.find({
            $or: [
                { userOneId: userOneId, status: 'ACCEPTED' },
                { userTwoId: userOneId, status: 'ACCEPTED'}
            ]
        });

        let friendsUser2 = await Friend.find({
            $or: [
                { userOneId: userTwoId, status: 'ACCEPTED' },
                { userTwoId: userTwoId, status: 'ACCEPTED' }
            ]
        });

        // get the otheruser Ids from friendsuser1 other than itself
        friendsUser1 = friendsUser1.map(friend => {
            if(friend.userOneId.toString() === userOneId.toString()){
                return friend.userTwoId;
            }
            return friend.userOneId;
        });

        // get the otheruser Ids from friendsuser2 other than itself

        friendsUser2 = friendsUser2.map(friend => {
            if(friend.userOneId.toString() === userTwoId.toString()){
                return friend.userTwoId;
            }
            return friend.userOneId;
        });

        let mutualfriends: any = [];

        friendsUser1.forEach(friend => {
            friendsUser2.forEach(friend2 => {
                if(friend.toString() === friend2.toString()){
                    mutualfriends.push(friend);
                }
            });
        });

        mutualfriends = await User.find({
            _id: { $in: mutualfriends }
        });

        return NextResponse.json({ mutualfriends });

    } catch (error) {
        console.error('Error creating/getting conversation:', error);
        return NextResponse.json({ message: 'Internal server error' });
    }
}

