"use client";

import React from 'react'
import FriendSearch from './friend-search';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '../ui/separator';
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils';
import { UsersRound } from 'lucide-react';

import { FriendDirectMessageItem } from "./friend-direct-message-item";
import { DmSection } from "./dm-section";
import { useParams, useRouter } from 'next/navigation';
import { useListState } from '@/components/providers/list-provider';


const FriendSidebar = () => {

    const [directMessages, setdirectMessages] = useState([]);
    const params = useParams();
    const { list, setList } = useListState();
    const router = useRouter();

    const onDirectMessageRemove = (id: string) => {
        setdirectMessages(directMessages.filter((friend: any) => friend._id !== id));
    }

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
          const {friends} = await response.json();
          const allFriends = friends?.filter((friend: any) => friend.status === 'ACCEPTED' && (friend.userOneId._id === params?.userId || friend.userTwoId._id === params?.userId));
          setdirectMessages(allFriends);
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
                                <UsersRound size={20} strokeWidth={2.5} absoluteStrokeWidth className={cn("line-clamp-1 font-semibold text-m text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                                    true && "text-primary dar:text-zinc-200 dark:group-hover:text-white"
                                )} />

                                <p className={cn("line-clamp-1 font-semibold text-m text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                                    true && "text-primary dar:text-zinc-200 dark:group-hover:text-white"

                                )}>
                                    Friends
                                </p>
                            </button>
                        </div>
                    </div>
                </ScrollArea>

                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                    <DmSection label="Direct Messages" />
                
                    {!!directMessages?.length && (
                        <div className="mb-2">
                            
                            <div className="spca-y-[2px]">
                                {directMessages.map((friend) => (
                                    <FriendDirectMessageItem key={friend._id} friend={friend} userId={params?.userId} onRemove={onDirectMessageRemove} />
                                ))}
                            </div>
                        </div>

                    )}

            </div>
        </div>
    )
}

export default FriendSidebar