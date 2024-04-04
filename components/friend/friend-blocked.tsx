"use client";
import { Separator } from '@radix-ui/react-dropdown-menu';
import React, { useState } from 'react';
import FriendItemBlocked from './friend-item-blocked';


interface FriendBlockedProps {
    blockedFriends: any,
    userId: string
}


const FriendBlocked = ({
    blockedFriends,
    userId
}: FriendBlockedProps) => {

    const [blockedfriends, setBlockedFriends] = useState(blockedFriends);

    const onUnblockFriend = async (id: string) => {
        setBlockedFriends(blockedfriends.filter((friend: any) => friend._id !== id));
        await fetch("/api/friend/unblockfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friendId: id
            })
        });
    }


    return (

        <>
        <div className="flex items-center mt-5 ml-8 p-2">
            <p className="text font-semibold text-zinc-500 dark:text-zinc-400">Blocked Friends - </p>
            <p className="ml-1 text font-semibold text-muted-foreground dark:text-muted-foreground">{blockedFriends.length}</p>
        </div>

        <div className="bg-[#313338] ml-7 p-2 rounded-lg">
            <p className="text-gray-400 text-sm mb-4">
                You can unblock friends from this list.
            </p>
        </div>

        <Separator className="h-[3px] bg-zinc-300 dark:bg-zinc-700 rounded-md ml-8" style={{ maxWidth: "93%" }}/>
        <div className="p-4 mt-3 flex flex-col gap-y-2 ml-5">

            {blockedfriends?.length > 0 ? blockedfriends.map((friend: any) => (
                <FriendItemBlocked 
                key={friend._id}
                friend={friend}
                userId={userId}
                onUnblockFriend={onUnblockFriend}
                />
                )) : <div className="text-center text-white">No blocked friends</div>}
        </div>
        
    </>
    )
}

export default FriendBlocked