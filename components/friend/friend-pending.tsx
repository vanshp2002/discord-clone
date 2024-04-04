"use client";
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { UserAvatar } from '../user-avatar';
import { FaCheck} from 'react-icons/fa6';
import { RxCross1 } from "react-icons/rx";
import { Separator } from '../ui/separator';
import { ActionToolTip } from '../ui/action-tooltip';


interface FriendPendingProps {
    rec: any,
    sent: any
}


const FriendPending = ({
    rec,
    sent
}: FriendPendingProps) => {

    const params = useParams();
    const totalPending = rec.length + sent.length;
    const [recvPending,setRecvPending] = useState(rec);
    const [sentPending,setsentPending] = useState(sent);
    const [tpend, setTpend] = useState(totalPending);
    const [isHoveredFriend, setIsHoveredFriend] = useState("");

    const onAccept = async (id: string) => {

        // rec.filter((friend: any) => friend._id !== id);
        setRecvPending(recvPending.filter((friend: any) => friend._id !== id));
        setTpend(tpend-1);
        
        const response = await fetch("/api/friend/acceptfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friendId: id
            })
        });

        setIsHoveredFriend("");
    }

    const onReject = async (id: string) => {
            
            // rec = rec.filter((friend: any) => friend._id !== id);
            setRecvPending(recvPending.filter((friend: any) => friend._id !== id));
            setTpend(tpend-1);
    
            const response = await fetch("/api/friend/rejectfriend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    friendId: id
                })
            });

            setIsHoveredFriend("");
        }

    const onWithdraw = async (id: string) => {
        // sent = sent.filter((friend: any) => friend._id !== id);
        setsentPending(sentPending.filter((friend: any) => friend._id !== id));
        setTpend(tpend-1);

        const response = await fetch("/api/friend/rejectfriend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friendId: id
            })
        });

        setIsHoveredFriend("");
    }

    return (

        <> 
            <div className="flex items-center mt-5 ml-8 p-4">
                <p className="text font-semibold text-zinc-500 dark:text-zinc-400">Pending</p>
                <p className="ml-3 text font-semibold text-muted-foreground dark:text-muted-foreground">{tpend}</p>
            </div>
                <Separator className="h-[3px] bg-zinc-300 dark:bg-zinc-700 rounded-md ml-8" style={{ maxWidth: "93%" }}/>
            <div className="p-4 mt-3 flex flex-col gap-y-2 ml-5">
                {recvPending.map((friend: any) => (
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
                            <ActionToolTip label="Accept" side='top'>
                                <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                    <FaCheck  onClick={() => onAccept(friend?._id)} className="stroke-1 text-zinc-200 text-sm h-4 w-4 md:h-5 md:w-5 hover:text-green-500" />
                                </div>
                            </ActionToolTip>
                            <ActionToolTip label="Reject" side='top'>
                                <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                    <RxCross1  onClick={() => onReject(friend?._id)} className="text-zinc-200 text-sm h-4 w-4 md:h-5 md:w-5 hover:text-red-500" />
                                </div>
                            </ActionToolTip>
                        </div>
                    </div>
                ))}
                {sentPending.map((friend: any) => (
                    <div key={friend._id} className="p-3.5 flex items-center justify-between gap-x-2 hover:bg-zinc-800/60" style={{ maxWidth: "94%" }}
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
                    <div className="flex gap-x-4 mr-6">
                        <ActionToolTip label="Withdraw" side='top'>
                            <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                <RxCross1  onClick={() => onWithdraw(friend?._id)} className="text-zinc-200 h-4 w-4 md:h-5 md:w-5 hover:text-red-500" />
                            </div>
                        </ActionToolTip>
                    </div>
                </div>
                ))}
            </div>
            
        </>        
    )
}

export default FriendPending;