"use client";
import React, { useState } from 'react'
import { Separator } from '../ui/separator';
import FriendItem from './friend-item';


interface FriendAllProps {
    allfriends?: any,
    userId?: string
}


const FriendAll = ({
    allfriends,
    userId,
}: FriendAllProps) => {

    const [totalFriends, setTotalFriends] = useState(allfriends.length);
    const [allFriends, setAllFriends] = useState(allfriends);

    const onRemoveFriend = async (id: string) => {
        setAllFriends(allFriends.filter((friend: any) => friend._id !== id));
        setTotalFriends(totalFriends-1);

        await fetch("/api/friend/rejectfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friendId: id
            })
        });
    }

    const onBlockFriend = async (id: string) => {
        setAllFriends(allFriends.filter((friend: any) => friend._id !== id));
        setTotalFriends(totalFriends-1);

        await fetch("/api/friend/blockfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friendId: id,
                userId: userId
            })
        });
    }


    return (
        <> 
        <div className="flex items-center mt-5 ml-8 p-4">
            <p className="text font-semibold text-zinc-500 dark:text-zinc-400">All Friends - </p>
            <p className="ml-3 text font-semibold text-muted-foreground dark:text-muted-foreground">{totalFriends}</p>
        </div>
            <Separator className="h-[3px] bg-zinc-300 dark:bg-zinc-700 rounded-md ml-8" style={{ maxWidth: "93%" }}/>
        <div className="p-4 mt-3 flex flex-col gap-y-2 ml-5">
            {allFriends.map((friend: any) => (
                <FriendItem friend={friend} userId={userId} onRemoveFriend={onRemoveFriend} onBlockFriend={onBlockFriend}/>
            ))}
        </div>
        
    </>        
    )
}

export default FriendAll