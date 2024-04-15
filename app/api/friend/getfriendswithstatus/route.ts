import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import Friend from "@/models/friend";
import User from "@/models/user";
import Status from "@/models/status";

export async function POST(req) {
    try{

        await connectMongoDB();
        const {userId} = await req.json();

        let friends = await Friend.find({
            $or: [
                { userOneId: userId },
                { userTwoId: userId }
            ]
        });

        let otherfriends = friends.map(friend => {
            if(friend.userOneId.toString() === userId.toString()){
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
        
        let uniqueUserIds = userIdsWithStatus.length > 0 ? userIdsWithStatus[0].userIds : [];

        uniqueUserIds.unshift(userId); 

        let [populateFriends, statuses] = await Promise.all([
            User.find({ _id: { $in: Array.from(uniqueUserIds) } }).lean(),
            Status.find({ userId: { $in: Array.from(uniqueUserIds) } })
        ]);

        //make a nested object with friend and status
        populateFriends = populateFriends.map(friend => {
            return { ...friend, status: [] };
        });

        statuses.forEach(status => {
            const friend = populateFriends.find(friend => friend?._id?.toString() === status.userId.toString());
            friend?.status.push(status);
        });

        //make sure the friends are in the same order as the uniqueUserIds
        populateFriends = uniqueUserIds.map(id => populateFriends.find(friend => friend?._id?.toString() === id.toString()));

        return NextResponse.json({ friendsWithStatus: populateFriends });

    } catch (error) {
        console.log(error);
    }
}