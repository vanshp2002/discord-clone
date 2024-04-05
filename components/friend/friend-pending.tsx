"use client";
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { UserAvatar } from '../user-avatar';
import { FaCheck } from 'react-icons/fa6';
import { RxCross1 } from "react-icons/rx";
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
    const [recarr, setRecarr] = useState(rec);
    const [sentarr, setSentarr] = useState(sent);
    const [totalPending, SetTotalPending] = useState(sentarr.length + recarr.length);
    const [isHoveredFriend, setIsHoveredFriend] = useState("");

    const onAccept = async (id: string) => {
        setRecarr(recarr.filter((friend: any) => friend._id !== id));
        SetTotalPending(totalPending - 1);
        const response = await fetch("/api/friend/acceptfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friendId: id
            })
        });
    }

    const onReject = async (id: string) => {
        setRecarr(recarr.filter((friend: any) => friend._id !== id));
        SetTotalPending(totalPending - 1);
        const response = await fetch("/api/friend/rejectfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friendId: id
            })
        });
    }

    const onWithdraw = async (id: string) => {
        setSentarr(sentarr.filter((friend: any) => friend._id !== id));
        SetTotalPending(totalPending - 1);
        const response = await fetch("/api/friend/rejectfriend", {
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
        <div>

           {totalPending!==0 && <div className="flex items-center mt-5 ml-8 p-4">
                <p className="text font-semibold text-zinc-500 dark:text-zinc-400">Pending</p>
                <p className="ml-3 text font-semibold text-muted-foreground dark:text-muted-foreground">{totalPending}</p>
            </div>}
            {totalPending!==0 && <Separator className="h-[3px] bg-zinc-300 dark:bg-zinc-700 rounded-md ml-8" style={{ maxWidth: "93%" }} />}
            <div className="p-4 mt-3 flex flex-col gap-y-2 ml-5">
                {recarr.map((friend: any) => (
                    <div key={friend._id} className="p-3.5 flex justify-between gap-x-2 hover:bg-zinc-800/60" style={{ maxWidth: "94%" }}
                        onMouseEnter={() => setIsHoveredFriend(friend._id)}
                        onMouseLeave={() => setIsHoveredFriend("")}
                    >
                        <div className="flex items-center gap-x-2">
                            <UserAvatar src={friend.userOneId.imageUrl} />
                            <div className="ml-1">
                                <div className="flex items-center gap-x-1">
                                    <p className="text font-semibold text-zinc-500 dark:text-zinc-400 text-[16px]">{friend.userOneId.displayname}</p>
                                    {isHoveredFriend === friend._id && <div className="ml-1.5 top-1/2 text-[13px] text-zinc-500 dark:text-zinc-400"> @ {friend.userOneId.username} </div>}
                                </div>
                                <p className="ml-0 text-xs text-muted-foreground dark:text-muted-foreground">Incoming Friend Request</p>
                            </div>
                        </div>
                        <div className="flex gap-x-4 mr-5">
                            <ActionTooltip label="Accept" side='top'>
                                <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                    <FaCheck onClick={() => onAccept(friend?._id)} className="stroke-1 text-zinc-200 text-sm h-4 w-4 md:h-5 md:w-5 hover:text-green-500" />
                                </div>
                            </ActionTooltip>
                            <ActionTooltip label="Reject" side='top'>
                                <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                    <RxCross1 onClick={() => onReject(friend?._id)} className="text-zinc-200 h-4 w-4 md:h-5 md:w-5 hover:text-red-500" />
                                </div>
                            </ActionTooltip>
                        </div>
                    </div>
                ))}
                {sentarr.map((friend: any) => (
                    <div key={friend._id} className="p-3.5 flex justify-between gap-x-2 hover:bg-zinc-800/60" style={{ maxWidth: "94%" }}
                        onMouseEnter={() => setIsHoveredFriend(friend._id)}
                        onMouseLeave={() => setIsHoveredFriend("")}
                    >
                        <div className="flex items-center gap-x-2">
                            <UserAvatar src={friend.userTwoId.imageUrl} />
                            <div className="ml-1">
                                <div className="flex items-center gap-x-1">
                                    <p className="text font-semibold text-zinc-500 dark:text-zinc-400 text-[16px]">{friend.userTwoId.displayname}</p>
                                    {isHoveredFriend === friend._id && <div className="ml-1.5 top-1/2 text-[13px] text-zinc-500 dark:text-zinc-400"> @ {friend.userTwoId.username} </div>}
                                </div>
                                <p className="ml-0 text-xs text-muted-foreground dark:text-muted-foreground">Outgoing Friend Request</p>
                            </div>
                        </div>
                        <div className="flex gap-x-4 mr-5">
                            <ActionTooltip label="Reject" side='top'>
                                <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                    <RxCross1 onClick={() => onWithdraw(friend?._id)} className="stroke-1 text-zinc-200 text-sm h-4 w-4 md:h-5 md:w-5 hover:text-red-500" />
                                </div>
                            </ActionTooltip>
                        </div>
                    </div>
                ))}
            </div>
            {totalPending === 0 && (
                <div className="container"><img src="https://utfs.io/f/4c1e8889-4946-426e-8c18-6a994fa739cc-uzt6wn.png" alt="cartoon"/></div>
            )}
            </div>

        </>
    )
}

export default FriendPending;
