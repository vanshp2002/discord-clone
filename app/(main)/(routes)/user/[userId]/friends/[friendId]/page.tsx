"use client";

import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChatHeader from '@/components/chat/chat-header';
import { DirectChatMessages } from '@/components/chat/direct-chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { useSharedState } from '@/components/providers/reply-provider';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import UserCardSidebar from '@/components/user-card-sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FriendIdPageProps {

}

const FriendIdPage = ({

}: FriendIdPageProps) => {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const [gchannel, setGchannel] = useState(null);
    const [gmember, setGmember] = useState(null);
    const [guser, setGuser] = useState(null);
    const [gconversation, setGconversation] = useState(null);
    const [otherMem, setOtherMem] = useState(null);
    const [mutualFriends, setMutualFriends] = useState(null);
    const { replyMessage, setReplyMessage } = useSharedState("");
    const handleClose = () => {
        setReplyMessage("");
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(params.userId, params.friendId);
                const userfind = await fetch("/api/getuserbyid", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: params?.userId
                    }),
                });
                const {user} = await userfind.json();

                console.log(user);
                
                setGuser(user);
                
                const friendfound = await fetch("/api/getuserbyid", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: params?.friendId,
                    }),
                });
                const {user:friend} = await friendfound.json();
                await setOtherMem(friend);
                console.log(friend);

                const con = await fetch("/api/conversations/getorcreatefriendconversation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        memberOneId: params?.userId,
                        memberTwoId: params?.friendId
                    }),
                })

                const { conversation } = await con.json();

                await setGconversation(conversation);

                const mutualFriends = await fetch("/api/friend/mutualfriend", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userOneId: user?._id,
                        userTwoId: friend?._id,
                    }),
                  });
      
                  const {mutualfriends: mutualfriend} = await mutualFriends.json();
                  setMutualFriends(mutualfriend);


            }
            catch (error) {
                console.log(error);
            }
        }
        fetchData();

    }, []);
    return (


        <div className="bg-white dark:bg-[#313338] flex flex-col h-full" style={{overflow: "hidden"}}>

            {guser && otherMem && <ChatHeader imageUrl={otherMem?.imageUrl} name={otherMem?.displayname} type="conversation" />}

            <div className="flex h-full">

            <div className="flex flex-col h-full w-[74%]" style={{ overflow: 'hidden' , maxHeight: 'calc(100vh - 50px)' }}>

            <ScrollArea className="flex-grow">

            {guser && otherMem && gconversation && <DirectChatMessages
                member={guser}
                otherName={otherMem?.displayname}
                otherUsername={otherMem?.username}
                otherImage={otherMem?.imageUrl}
                name={otherMem?.displayname}
                chatId={gconversation._id}
                type="conversation"
                apiUrl="/api/direct-messages"
                paramKey="conversationId"
                paramValue={gconversation._id}
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                    conversationId: gconversation._id,
                    userId: guser._id
                }}
            />}

            </ScrollArea>

            {guser && otherMem && gconversation && <ChatInput
                name={otherMem?.displayname}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{
                    conversationId: gconversation._id,
                    userId: guser._id
                }}
            />}
        </div>

        <div className="w-[26%]">
                {otherMem && <UserCardSidebar user={otherMem} mutualFriends={mutualFriends}/>}
        </div>
        </div>        
        </div>
    )
}

export default FriendIdPage