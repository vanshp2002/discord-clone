import { Hash} from 'lucide-react';
import React from 'react'
import {MobileToggle} from '@/components/mobile-toggle'
import {UserAvatar} from "@/components/user-avatar"
import { SocketIndicator } from '@/components/socket-indicator';
import { PinnedMessages } from './pinned-messages';

interface ChatHeaderProps {
    serverId?: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
    email?:string;
    chatId: string;
}

const ChatHeader = ({ 
    serverId,
    name,
    type,
    imageUrl,
    email,
    chatId
}: ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-natural-200 dark:border-neutral-800 border-b-2">
            {serverId && <MobileToggle serverId={serverId}/>}
            {type === "channel" && (
                <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
            )}
            {type === "conversation" && (
                <UserAvatar src={imageUrl}
                className="h-8 w-8 md:h-8 md:w-8 mr-2"/>
            )}
            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>
           
            <div className="ml-auto gap-x-2 flex items-center">
                <PinnedMessages chatId={chatId} type={type} />
                <SocketIndicator/>
            </div>
        </div>
    )
}

export default ChatHeader