"use client";
import { useParams } from 'next/navigation';
import React from 'react'
import { UserAvatar } from '../user-avatar';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Separator } from '../ui/separator';
import { ActionTooltip } from '../action-tooltip';


interface FriendPendingProps {
    rec: any
    sent: any
}


const FriendPending = ({
    rec,
    sent
}: FriendPendingProps) => {

    const params = useParams();
    const totalPending = rec.length + sent.length;

    return (

        <>

            <div className="flex items-center mt-5 ml-8 p-4">
                <p className="text font-semibold text-zinc-500 dark:text-zinc-400">Pending</p>
                <p className="ml-3 text font-semibold text-muted-foreground dark:text-muted-foreground">{totalPending}</p>
            </div>
            <Separator className="h-[3px] bg-zinc-300 dark:bg-zinc-700 rounded-md ml-8" style={{ maxWidth: "93%" }} />
            <div className="p-4 mt-3 flex flex-col gap-y-2 ml-5">
                {rec.map((friend: any) => (
                    <div key={friend._id} className="p-3.5 flex justify-between gap-x-2 hover:bg-zinc-800/60" style={{ maxWidth: "94%" }}>
                        <div className="flex items-center gap-x-2">
                            <UserAvatar src={friend.userOneId.imageUrl} />
                            <div className="ml-1">
                                <p className="text font-semibold text-zinc-500 dark:text-zinc-400">{friend.userOneId.username}</p>
                                <p className="ml-0 text-xs text-muted-foreground dark:text-muted-foreground">Incoming Friend Request</p>
                            </div>
                        </div>
                        <div className="flex gap-x-4 mr-5">
                            <ActionTooltip label="Accept" side='top'>
                                <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                    <FaCheck className="text-green-500 h-4 w-4 md:h-5 md:w-5" />
                                </div>
                            </ActionTooltip>
                            <ActionTooltip label="Reject" side='top'>
                                <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                    <FaTimes className="text-red-500 h-4 w-4 md:h-5 md:w-5" />
                                </div>
                            </ActionTooltip>
                        </div>
                    </div>
                ))}
                {sent.map((friend: any) => (
                    <div key={friend._id} className="p-3.5 flex items-center justify-between gap-x-2 hover:bg-zinc-800/60" style={{ maxWidth: "94%" }}>
                        <div className="flex items-center gap-x-2">
                            <UserAvatar src={friend.userTwoId.imageUrl} />
                            <div className="ml-1">
                                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{friend.userTwoId.username}</p>
                                <p className="ml-0 text-xs text-muted-foreground dark:text-muted-foreground">Outgoing Friend Request</p>
                            </div>
                        </div>
                        <div className="flex gap-x-4 mr-6">
                            <ActionTooltip label="Withdraw" side='top'>
                                <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                    <FaTimes className="text-red-500 h-4 w-4 md:h-5 md:w-5" />
                                </div>
                            </ActionTooltip>
                        </div>
                    </div>
                ))}
            </div>

        </>
    )
}

export default FriendPending;