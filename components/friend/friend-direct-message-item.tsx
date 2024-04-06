
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { UserAvatar } from '../user-avatar';
import { ActionToolTip } from '../ui/action-tooltip';
import { RxCross1 } from 'react-icons/rx';

interface FriendDMProps{
    friend: any;
    userId:string;
    onRemove: (id: string) => void;
}

export const FriendDirectMessageItem = ({
    friend,
    userId,
    onRemove
}: FriendDMProps) => {
    const params = useParams();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    const otherUser = friend.userOneId._id === userId ? friend.userTwoId : friend.userOneId;
    const [isRemoveDivHovered, setIsRemoveDivHovered] = useState(false);


    const onClick = () => {
        if (isRemoveDivHovered) return;
        router.push(`/user/${params?.userId}/friends/${otherUser?._id}`)
    }

    return (
        <div onClick={onClick} className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.friendId === otherUser?._id && "bg-zinc-700/20 dark:bg-zinc-700"
        )} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
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

            {isHovered && (
                <div className="absolute right-6">
                    <ActionToolTip label="Remove" side='top'>
                        <div onClick={() => onRemove(friend._id)} onMouseEnter={() => setIsRemoveDivHovered(true)} onMouseLeave={() => setIsRemoveDivHovered(false)}>
                            <RxCross1  className="text-zinc-200 text-sm h-3 w-3 md:h-4 md:w-4 hover:text-red-400" />
                        </div>
                    </ActionToolTip>
                </div>
            )}
        </div>
    )
}
