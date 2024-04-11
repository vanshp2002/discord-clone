"use client";
import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator';
import FriendItem from './friend-item';
import { useModal } from '@/hooks/use-modal-store';
import { useListState } from '../providers/list-provider';
import { Plus } from "lucide-react";

interface FriendAllProps {
    allfriends?: any,
    userId?: string
}


const FriendAll = ({
    allfriends,
    userId,
}: FriendAllProps) => {
    const { onOpen, onClose } = useModal();

    const [totalFriends, setTotalFriends] = useState(allfriends.length);
    const [allFriends, setAllFriends] = useState(allfriends);
    const { list, setList } = useListState();
    const [friendsWithStatus, setFriendsWithStatus] = useState([]);
    const [selectedStory, setSelectedStory] = useState("");

    const onRemoveFriend = async (id: string) => {
        allfriends = allfriends.filter((friend: any) => friend._id !== id);
        setAllFriends(allfriends);
        setTotalFriends(totalFriends - 1);

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
        allfriends = allfriends.filter((friend: any) => friend._id !== id);
        setAllFriends(allfriends);
        setTotalFriends(totalFriends - 1);

        await fetch("/api/friend/blockfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friendId: id,
                userId
            })
        });
    }

    useEffect(() => {
        if (list === "all") {

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
                const { friendsWithStatus } = await response.json();
                setFriendsWithStatus(friendsWithStatus);
            }

            fetchFriendsWithStatus();
        }

    }, [list]);

    const handleStoryClick = (friendId: string) => {
        setSelectedStory(friendId);
        // Here you would load the story data and then remove the loading state
        setTimeout(() => {
            setSelectedStory("")
            onOpen("viewStatus", { user: friendId })
        }
            , 600); // Simulate loading time
    };

    return (
        <>
            <div className="flex items-center mt-5 ml-8 p-4">
                <p className="text font-semibold text-zinc-500 dark:text-zinc-400">All Friends  </p>
                <p className="ml-3 text font-semibold text-muted-foreground dark:text-muted-foreground">{totalFriends}</p>
            </div>
            <div className="p-4 mt-3 flex gap-y-2 my-auto">
                <div className="bg-[#313338] py-4 overflow-x-auto">

                    <div onClick={() => onOpen("uploadStatus", { user: userId })} className="flex mx-3 h-16 w-16 rounded-full transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-[#248046]">
                        <Plus className="group-hover:text-white transition text-white" size={30}>

                        </Plus>
                    </div>
                    <div className="text-xs text-center py-1 items-center justify-center">
                        Add Status
                    </div>

                </div>
                <Separator className="h-16 my-auto w-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md ml-8" />
                <div className="flex space-x-4 px-4 py-4 bg-[#313338] overflow-x-auto">
                    {friendsWithStatus && friendsWithStatus.map((friend) => (
                        <div key={friend._id} className="items-center justify-center">
                        <div className="relative">
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
                                    <div className="rounded-full border-2 border-t-2 border-purple-600 h-full w-full"></div>
                                </div>
                            )
                            }
                        </div>
                            <div className="text-xs text-center py-1 items-center justify-center">
                                {friend.displayname}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Separator className="h-[3px] bg-zinc-300 dark:bg-zinc-700 rounded-md ml-8" style={{ maxWidth: "93%" }} />
            <div className="p-4 mt-3 flex flex-col gap-y-2 ml-5">
                {allFriends.map((friend: any) => (
                    <FriendItem friend={friend} userId={userId} onRemoveFriend={onRemoveFriend} onBlockFriend={onBlockFriend} />
                ))}
            </div>

        </>
    )
}

export default FriendAll