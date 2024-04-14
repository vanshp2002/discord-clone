"use client";
import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator';
import FriendItem from './friend-item';
import { useModal } from '@/hooks/use-modal-store';
import { useListState } from '../providers/list-provider';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { EffectCoverflow, Pagination } from 'swiper/modules';
import { Plus } from 'lucide-react';
import { UserAvatar } from '../user-avatar';



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
    const [selectedStory, setSelectedStory] = useState(-2);
    const [isStoriesOpen, setIsStoriesOpen] = useState(false);
    const [guser, setGuser] = useState(null);

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
                let ownStory = friendsWithStatus[0];
                friendsWithStatus.shift();
                setFriendsWithStatus(friendsWithStatus);
                setGuser(ownStory);
            }

            fetchFriendsWithStatus();
        }

    }, [list] );

    const handleStoryClick = (index: number) => {
        setSelectedStory(index);
        // Here you would load the story data and then remove the loading state
        setTimeout(() => {
            setSelectedStory(-2);
            onOpen("viewStatus", {currIndex: index, statuses: friendsWithStatus})
            // setIsStoriesOpen(true);
        }
        , 600); // Simulate loading time
      };

    const handleOwnStoryClick = () => {
        setSelectedStory(-1);
        // Here you would load the story data and then remove the loading state
        setTimeout(() => {
            setSelectedStory(-2);
            onOpen("viewStatus", {currIndex: -1, statuses: [guser]})
            // setIsStoriesOpen(true);
        }
        , 600); // Simulate loading time
      }


    return (
        <> 
        <button onClick={() => onOpen("uploadStatus", {user: userId})} className="bg-green-500 text-white rounded-md p-2 mt-5 ml-8">Add Story</button>

        <div className="flex items-center mt-5 ml-8 p-4">
            <p className="text font-semibold text-zinc-500 dark:text-zinc-400">Stories </p>
        </div>
        <Separator className="h-[3px] bg-zinc-300 dark:bg-zinc-700 rounded-md ml-8" style={{ maxWidth: "93%" }}/>
        <div className="p-4 mt-3 flex gap-y-2 my-auto">
                <div className="bg-[#313338] py-4 overflow-x-hidden ml-10">

                <div className="items-center justify-center">
                        <div className="relative">
                            <img
                                src={guser?.imageUrl}
                                alt={`${guser?.username}'s story`}
                                className="h-16 w-16 rounded-full object-cover cursor-pointer p-1"
                                onClick={() => handleOwnStoryClick()}
                            />
                            {selectedStory === -1 ? (
                                <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                                    <div className="animate-spin rounded-full border-2 border-t-transparent border-purple-600 h-full w-full"></div>
                                </div>
                            ) : (
                                <div onClick={() => handleOwnStoryClick()} className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                                    <div className="rounded-full border-2 border-t-2 border-purple-600 h-full w-full"></div>
                                </div>
                            )
                            }

                            <div>
                                <Plus className="h-5 w-5 absolute top-0 right-0 bg-green-500 text-white rounded-full cursor-pointer p-0.5" />
                            </div>
                        </div>
                            <div className="text-xs text-center py-1 items-center justify-center">
                                Your Story
                            </div>
                </div>

                </div>
                <Separator className="h-16 mt-5 w-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md ml-5" />
                <div className="flex space-x-4 px-4 py-4 bg-[#313338]">
                    {friendsWithStatus && friendsWithStatus.map((friend: any,index) => (
                        <div key={friend._id} className="items-center justify-center">
                        <div className="relative " onClick={() => handleStoryClick(index)}>
                            <div className="flex h-16 w-16 rounded-full items-center justify-center">
                            <img
                                src={friend.imageUrl}
                                alt={`${friend.username}'s story`}
                                className="h-16 w-16 rounded-full object-cover cursor-pointer p-1"
                                onClick={() => handleStoryClick(index)}
                            />
                            </div>
                            {selectedStory === index ? (
                                <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                                    <div className="animate-spin rounded-full border-2 border-t-transparent border-purple-600 h-full w-full"></div>
                                </div>
                            ) : (
                                <div onClick={() => handleStoryClick(index)} className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                                    <div className="rounded-full border-2 border-t-2 border-purple-600 h-full w-full"></div>
                                </div>
                            )
                            }
                        </div>
                        <div className="text-xs text-center py-1 items-center justify-center w-12 ml-2" style={{ overflowWrap: 'break-word' }}>
                            {friend.displayname}
                        </div>
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