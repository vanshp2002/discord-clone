"use client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { UserAvatar } from "../user-avatar";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { BsPinAngleFill } from "react-icons/bs";
import { RiUnpinFill } from "react-icons/ri";
import { Separator } from "../ui/separator";
import { ActionToolTip } from "../ui/action-tooltip";


interface PinnedMessagesProps {
    chatId: string;
    type: "channel" | "conversation";
}

export const PinnedMessages = ({ chatId, type}: PinnedMessagesProps) => {
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [isHovered, setIsHovered] = useState(null);

    // const onPinMessage = (messageId: string) => {
    //     const message = pinnedMessages.find((message: any) => message._id === messageId);
    //     message.isPinned = !message.isPinned;
    //     setPinnedMessages([...pinnedMessages]);
    // }

    useEffect(() => {
        const fetchdata = async () => {
          const response = await fetch("/api/messages/fetchPinnedMessages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chatId: chatId,
                type: type
            })
          });
          const {pinnedMessages} = await response.json();
          setPinnedMessages(pinnedMessages);
        }
        fetchdata();
    }, []);

    const onUnpinMessage = async (messageId: string) => {
        
        setPinnedMessages(pinnedMessages.filter((message: any) => message._id !== messageId));

        const response = await fetch("/api/messages/unpin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chatId: chatId,
                messageId: messageId,
                type: type
            })
        });
    }

    return (
        <>
            <Popover>

                <PopoverTrigger>
                    <BsPinAngleFill className='w-5 h-5 text-neutral-500 dark:text-neutral-400' />
                </PopoverTrigger>

                <PopoverContent className="h-[100%] w-[150%] p-2" side="bottom" sideOffset={10} align="start" alignOffset={-300}>

                    <div className='flex flex-col p-2 gap-y-2'>
                        <div className="flex justify-between items-center">
                        <p className='text-sm font-semibold text-neutral-500 dark:text-neutral-400'>Pinned Messages</p>
                        {pinnedMessages.length}
                        </div>

                        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md" style={{ maxWidth: "98%" }}/>
                    {pinnedMessages.length > 0 && 

                            <div className='flex flex-col gap-y-2 bg-zinc-500 dark:bg-zinc-800 p-2 mt-3'>
                                
                                {pinnedMessages.map((message: any) => (
                                    <div key={message._id} className='flex items-center relative' onMouseEnter={() => setIsHovered(message._id)} onMouseLeave={() => setIsHovered(null)}
                                    >
                                        {type === "channel" ? (
                                            <UserAvatar src={message.memberId.userId.imageUrl} className='w-4 h-4 md:h-6 md:w-6' />
                                            ) : (
                                            <UserAvatar src={message.memberId.imageUrl} className='w-4 h-4' />
                                        )}
                                        <div className="ml-2">
                                            {type === "channel" ? (
                                                <p className='text-sm text-neutral-500 dark:text-neutral-400'>{message.memberId.userId.displayname}</p>
                                                ) : (
                                                <p className='text-sm text-neutral-500 dark:text-neutral-400'>{message.memberId.displayname}</p>
                                            )}
                                            <p className='text-xs mt-1 text-neutral-500 dark:text-neutral-400'
                                            >
                                                {message.content}
                                            </p>
                                        </div>

                                        {isHovered === message._id && (
                                            <ActionToolTip label="Unpin">
                                                <div className='absolute right-4 mt-0.5'>
                                                    <RiUnpinFill onClick={() => onUnpinMessage(message._id)} className='w-4 h-4 text-neutral-500 dark:text-neutral-400' />
                                                </div>
                                            </ActionToolTip>
                                        )}
                                    </div>
                                ))}
                            </div> 
                    }
                    </div>

                </PopoverContent>

            </Popover>
        </>
    )
}
