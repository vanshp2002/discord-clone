"use client";

// import { Smile } from "lucide-react";
// import Picker, { Emoji } from "emoji-picker-react";
import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { ActionToolTip } from "@/components/ui/action-tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { EmojiStyle, Theme, SuggestionMode } from 'emoji-picker-react';
import { UserAvatar } from "./user-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { set } from "mongoose";

interface ReactionDisplayerProps {
    onReactionClick: (value1:string, value2: string) => void;
//   isHovered: boolean;
    type: string;
    emoji: string;
    memberId: any;
    currentMemberId: string;
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-3 mt-1 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-3 mt-1 text-rose-500" />,
}


export const ReactionDisplayer = ({
    // onChange,
    // isHovered,
    onReactionClick,
    type,
    emoji,
    memberId,
    currentMemberId
}: ReactionDisplayerProps) => {
    // const { resolvedTheme } = useTheme();
    const [ shouldShow, setShouldShow ] = useState(false);

    // useEffect(() => {
    //     if(!isHovered && shouldShow){
    //         setShouldShow(false);
    //     }

    // }, [isHovered]);
    console.log("memberId", memberId);

    const handleOpenChange = () => {
        setShouldShow(!shouldShow);
    }

    const handleClick = (emoji: string, currentMemberId: string) => {
        return () => {
            onReactionClick(emoji, currentMemberId);
            setShouldShow(false);
        }
    }

    return (

        // <Popover open={shouldShow} onOpenChange={handleOpenChange}>
        <Popover open={shouldShow} onOpenChange={handleOpenChange}>
            <PopoverTrigger>
                <div className="h-6 rounded px-1 text-xs flex items-center bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200">
                    {emoji} {memberId.length}
                </div>
            </PopoverTrigger>
            <PopoverContent
                side="right"
                hideWhenDetached={true}
                className="shadow-none drop-shadow-none mb-16 px-2 py-2"
            >
                <div>
                    <div className="mb-2 items-center">
                        {emoji} {memberId.length}
                    </div>
                    {memberId.map((member: any) => (
                        <div>
                        <div className="flex px-1 py-1 rounded bg-zinc-700/55 hover:bg-zinc-700/85" key={member._id}>
                            {type==="channel" && <UserAvatar src={member.userId.imageUrl} className="h-8 w-8 md:h-8 md:w-8" />}
                            {type==="conversation" && <UserAvatar src={member.imageUrl} className="h-8 w-8 md:h-8 md:w-8" />}
                            {type==="channel" && <span className="text-[14px] ml-1 py-1 px-2 flex"> {member.userId.username} 
                                    {roleIconMap[member.role]}
                            </span>}
                            {type==="conversation" && <span className="text-[14px] ml-1 mr-9 py-1 px-2"> {member.username}
                            </span>}
                            
                                {member._id === currentMemberId && (
                                    <button onClick={handleClick(emoji, currentMemberId)} className="ml-8 top-1/2 text-[9px] items-right">
                                        Tap to remove
                                    </button>
                                )}
                        </div>
                            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700" />
                        </div>
                    ))}
                </div>
                
            </PopoverContent>
        </Popover>
    )
}

