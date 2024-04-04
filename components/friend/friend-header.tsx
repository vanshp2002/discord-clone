"use client";

import React from 'react'
import { Separator } from '@radix-ui/react-dropdown-menu';
import { HiUser } from "react-icons/hi2";
import FriendAll from './friend-all';
import FriendList from './friend-list';
import FriendOnline from './friend-online';
import { useListState } from '@/components/providers/list-provider';
import { cn } from '@/lib/utils';

interface FriendHeaderProps { }

const FriendHeader = ({ }: FriendHeaderProps) => {

    const { list, setList } = useListState();

    return (
        <>
            <div className="px-3 flex items-center py-3 border-natural-200 dark:border-neutral-800 border-b-2">
                <div className="flex space-x-4">
                    <div className="text-white cursor-pointer flex font-semibold">
                        <HiUser className="h-6 w-6 mx-2 font-semibold text-m text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition" />
                        Friends
                    </div>
                    <Separator className="w-[1px] bg-zinc-300 dark:bg-zinc-700 rounded-md h-7 my-auto" />
                    <div onClick={() => setList("online")} className={cn("font-semibold cursor-pointer px-2 py-1/2 my-auto text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-zinc-700 rounded transition",
                        list === "online" && "bg-zinc-600 dark:text-zinc-300 transition-all")}>
                        Online
                    </div>
                    <div onClick={() => setList("all")} className={cn("font-semibold cursor-pointer px-2 py-1/2 my-auto text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-zinc-700 rounded transition",
                        list === "all" && "bg-zinc-600 dark:text-zinc-300 transition-all")}>
                        All
                    </div>
                    <div onClick={() => setList("pending")} className={cn("font-semibold cursor-pointer px-2 py-1/2 my-auto text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-zinc-700 rounded transition",
                        list === "pending" && "bg-zinc-600 dark:text-zinc-300 transition-all")}>
                        Pending
                    </div>
                    <div onClick={() => setList("blocked")} className={cn("font-semibold cursor-pointer px-2 py-1/2 my-auto text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-zinc-700 rounded transition",
                        list === "blocked" && "bg-zinc-600 dark:text-zinc-300 transition-all")}>
                        Blocked
                    </div>
                    <div onClick={() => setList("addfriend")} className={cn("font-semibold cursor-pointer px-2 py-1/2 my-auto  text-zinc-900 dark:text-zinc-200 dark:bg-[#248046] rounded",
                        list === "addfriend" && "dark:text-[#248046] dark:bg-[#313338] transition-all")}>
                        Add Friend
                    </div>
                </div>
            </div>
        </>
    );
};

export default FriendHeader;
