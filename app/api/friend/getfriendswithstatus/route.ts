import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import Friend from "@/models/friend";
import User from "@/models/user";
import Status from "@/models/status";

export async function POST(req) {
    try {

        await connectMongoDB();
        const { userId } = await req.json();

        let friends = await Friend.find({
            $or: [
                { userOneId: userId },
                { userTwoId: userId }
            ]
        });

        let otherfriends = friends.map(friend => {
            if (friend.userOneId.toString() === userId.toString()) {
                return friend.userTwoId;
            }
            return friend.userOneId;
        });

        // filter out the userIds who have atleast one status uploaded
        const userIdsWithStatus = await Status.aggregate([
            {
                $match: {
                    userId: { $in: otherfriends }
                }
            },
            {
                $group: {
                    _id: "$userId"
                }
            },
            {
                $group: {
                    _id: null,
                    userIds: { $addToSet: "$_id" }
                }
            }
        ]);

        const uniqueUserIds = userIdsWithStatus.length > 0 ? userIdsWithStatus[0].userIds : [];

        const populateFriends = await User.find({
            _id: { $in: uniqueUserIds }
        });

        return NextResponse.json({ friendsWithStatus: populateFriends });

    } catch (error) {
        console.log(error);
    }
}