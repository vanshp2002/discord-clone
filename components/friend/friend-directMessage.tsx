"use client";
import { cn } from '@/lib/utils';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { UserAvatar } from '../user-avatar';

interface FriendDmProps{
    friend: any;
    userId:string;
}

const FriendDirectMessage = ({
    friend,
    userId
}: FriendDmProps) => {
    const params = useParams();
    const router = useRouter();

    const otherUser = friend.userOneId._id === userId ? friend.userTwoId : friend.userOneId;


    const onClick = () => {
        router.push(`/user/${params?.userId}/friends/${otherUser?._id}`)
    }

    return (
        <button onClick={onClick} className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.friendId === otherUser?._id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}
        >
            <UserAvatar 
            src={otherUser.imageUrl} 
                className="h-8 w-8 md:h-8 md:w-8"
            />
            <p
                className={cn(
                    "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    params?.friendId === otherUser?._id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {otherUser?.displayname}
            </p>
        </button>
    )
}

export default FriendDirectMessage