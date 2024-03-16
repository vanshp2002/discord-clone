"use client";
import React from 'react'
import { Avatar, AvatarImage} from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const UserAvatar = ({ member, src }) => {
    return (
        <Avatar className={cn("h-7 w-7 md:h-10 md:w-10")}>
            <AvatarImage src={src}/>
        </Avatar>        
    )
}

export default UserAvatar