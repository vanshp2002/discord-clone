"use client";

import React from 'react'
import FriendSearch from './friend-search';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '../ui/separator';
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils';
import { UsersRound } from 'lucide-react';
import { HiUser } from "react-icons/hi2";
import FriendDirectMessage from "./friend-directMessage";
import DmSection from "./dm-section";
import { useParams, useRouter } from 'next/navigation';
import { useListState } from '@/components/providers/list-provider';
import { GiShoppingBag } from "react-icons/gi";


const FriendSidebar = () => {

    const [directMessages, setdirectMessages] = useState(null);
    const params = useParams();
    const { list, setList } = useListState();


    useEffect(() => {
        const fetchdata = async () => {
            console.log(params?.userId);
            const response = await fetch("/api/friend/allfriends", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: params?.userId
                })
            });
            const toJson = await response.json();
            const temp = (toJson.friends);
            const allFriend = temp?.filter((friend: { type: any }) => friend.status === 'ACCEPTED' && (friend.userOneId._id === params?.userId || friend.userTwoId._id === params?.userId));
            setdirectMessages(allFriend);
        }
        fetchdata();
    }, [list]);

    return (
        <div className="flex flex-col h-full tetx-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <div className="mt-2 px-3 h-[30]">
                <FriendSearch
                    data={[]}
                />
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                <ScrollArea className="flex-1 px-1">
                    <div className="mt-2">
                        <div className="spca-y-[2px]">
                            <button onClick={() => { }}
                                className={cn(
                                    "group px-3 py-2 rounded-md flex items-center gap-x-3 w-full hover: bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                                    true && "bg-zinc-700/20 dark:bg-zinc-700"
                                )}>
                                <HiUser className={cn("h-6 w-6 line-clamp-1 font-semibold text-m text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                                    true && "text-primary dar:text-zinc-200 dark:group-hover:text-white"
                                )} />

                                <p className={cn("line-clamp-1 font-semibold text-m text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                                    true && "text-primary dar:text-zinc-200 dark:group-hover:text-white"

                                )}>
                                    Friends
                                </p>
                            </button>
                        </div>
                        <div className="spca-y-[2px]">
                            <button onClick={() => { }}
                                className={cn(
                                    "group px-3 py-2 rounded-md flex items-center gap-x-3 w-full hover: bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                                    true && "bg-zinc-700/20 dark:bg-zinc-700"
                                )}>
                                <GiShoppingBag className={cn("h-6 w-6 line-clamp-1 font-semibold text-m text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                                    true && "text-primary dar:text-zinc-200 dark:group-hover:text-white"
                                )} />

                                <p className={cn("line-clamp-1 font-semibold text-m text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                                    true && "text-primary dar:text-zinc-200 dark:group-hover:text-white"

                                )}>
                                    Shop
                                </p>
                            </button>
                        </div>
                    </div>
                </ScrollArea>
                <ScrollArea className="flex-1 px-1">
                    <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                    {!!directMessages?.length && (
                        <div className="mb-2">
                            <DmSection
                                label="Direct Messages"
                            />
                            <div className="spca-y-[2px]">
                                {directMessages.map((friend) => (
                                    <FriendDirectMessage key={friend._id} friend={friend} userId={params?.userId} />
                                ))}
                            </div>
                        </div>

                    )}

                </ScrollArea>
            </div>
        </div>
    )
}

export default FriendSidebar
