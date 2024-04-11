"use client";
import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator';
import FriendItem from './friend-item';
import { useModal } from '@/hooks/use-modal-store';
import { useListState } from '../providers/list-provider';


interface FriendAllProps {
    allfriends?: any,
    userId?: string
}


const FriendAll = ({
    allfriends,
    userId,
}: FriendAllProps) => {

    const {onOpen, onClose} = useModal();

    const [totalFriends, setTotalFriends] = useState(allfriends.length);
    const [allFriends, setAllFriends] = useState(allfriends);
    const {list, setList} = useListState();
    const [friendsWithStatus, setFriendsWithStatus] = useState([]);
    const [selectedStory, setSelectedStory] = useState("");

    const onRemoveFriend = async (id: string) => {
        setAllFriends(allFriends.filter((friend: any) => friend._id !== id));
        setTotalFriends(totalFriends-1);
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

    useEffect(() => {
        if(list==="all"){

            const fetchFriendsWithStatus = async () => {
                const response = await fetch("/api/friend/getfriendswithstatus/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: userId
                    })
                });
                const {friendsWithStatus} = await response.json();
                setFriendsWithStatus(friendsWithStatus);
            }

            fetchFriendsWithStatus();
        }

    }, [list] );

    const handleStoryClick = (friendId: string) => {
        setSelectedStory(friendId);
        // Here you would load the story data and then remove the loading state
        setTimeout(() => {
            setSelectedStory("")
            onOpen("viewStatus", {user: friendId})
        }
        , 600); // Simulate loading time
      };


    return (
        <> 
        
        <button onClick={() => onOpen("uploadStatus", {user: userId})}>
            Add status
        </button>

        <button onClick={() => onOpen("viewStatus", {user: userId})}>
            View status
        </button>

        <div className="flex items-center mt-5 ml-8 p-4">
            <p className="text font-semibold text-zinc-500 dark:text-zinc-400">Stories </p>
        </div>
            <Separator className="h-[3px] bg-zinc-300 dark:bg-zinc-700 rounded-md ml-8" style={{ maxWidth: "93%" }}/>
        <div className="p-4 mt-3 flex gap-y-2 ml-5">
            
        <div className="flex space-x-4 p-4 bg-[#313338] border-b border-gray-200 overflow-x-auto">
            {friendsWithStatus && friendsWithStatus.map((friend) => (
                <div key={friend._id} className="relative">
                <img
                    src={friend.imageUrl}
                    alt={`${friend.username}'s story`}
                    className="h-16 w-16 rounded-full object-cover cursor-pointer p-1"
                    onClick={() => handleStoryClick(friend._id)}
                />
                {selectedStory === friend._id ? (
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                    <div className="animate-spin rounded-full border-2 border-t-transparent border-purple-600 h-full w-full"></div>
                    </div>
                ) : (
                    <div onClick={() => handleStoryClick(friend._id)} className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                    <div className="rounded-full border-2 border-t-transparent border-purple-600 h-full w-full"></div>
                    </div>
                )
            }
                </div>
            ))}
            </div>
        </div>


        <div className="flex items-center mt-5 ml-8 p-4">
            <p className="text font-semibold text-zinc-500 dark:text-zinc-400">All Friends - </p>
            <p className="ml-3 text font-semibold text-muted-foreground dark:text-muted-foreground">{totalFriends}</p>
        </div>
            <Separator className="h-[3px] bg-zinc-300 dark:bg-zinc-700 rounded-md ml-8" style={{ maxWidth: "93%" }}/>
        <div className="p-4 mt-3 flex flex-col gap-y-2 ml-5">
            {allFriends.map((friend: any) => (
                <FriendItem key={friend._id} friend={friend} userId={userId} onRemoveFriend={onRemoveFriend} onBlockFriend={onBlockFriend}/>
            ))}
        </div>
        
    </>        
    )
}

export default FriendAll