"use client";

import { Smile } from "lucide-react";
import Picker, { Emoji } from "emoji-picker-react";
import { useEffect, useState } from "react";
// import data from "@emoji-mart/data";

// import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { EmojiStyle, Theme, SuggestionMode } from 'emoji-picker-react';

interface EmojiReactionPickerProps {
  // onChange: (value: string) => void;
  isHovered: boolean;
}


export const EmojiReactionPicker = ({isHovered}: EmojiReactionPickerProps) => {
    const { resolvedTheme } = useTheme();
    const [ shouldShow, setShouldShow ] = useState(false);

    useEffect(() => {
        if(!isHovered && shouldShow){
            setShouldShow(false);
        }

    }, [isHovered]);

    const handleOpenChange = () => {
        setShouldShow(!shouldShow);
    }

    return (

        <Popover open={shouldShow} onOpenChange={handleOpenChange}>
            <PopoverTrigger>
                <Smile
                  className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
            </PopoverTrigger>
            <PopoverContent
                side="right"
                // sideOffset={30}
                hideWhenDetached={true}
                className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
            >
                <Picker
                theme={Theme.DARK}
                allowExpandReactions={true}
                suggestedEmojisMode={SuggestionMode.RECENT}
                // onEmojiClick={(emoji: any) => onChange(emoji.emoji)}
                reactionsDefaultOpen={true}
                />
            </PopoverContent>
        </Popover>
    )
}

