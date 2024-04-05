"use client";

import React, { use } from 'react'
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrCreateFriendConversation } from '@/lib/friendConversation';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { useServerState } from "@/components/providers/server-provider";
import { useParams } from 'next/navigation';

interface MemberIdPageProps {

}

const MemberIdPage = ({
}: MemberIdPageProps) => {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const [currentMember, setCurrentMember] = useState(null);
    const [otherMember, setOtherMember] = useState(null);
    const [gconversation, setGconversation] = useState(null);
    const { serverUpdated, setServerUpdated } = useServerState();

  useEffect(() => {
    const fetchData = async () => {
      try{
          const userfind = await fetch(`/api/fetchUserById`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: params?.userId }),
            });

            const {user: user1} = await userfind.json();
            setCurrentMember(user1);

            const otherUser = await fetch(`/api/fetchUserById`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: params?.friendId,
                }),
            });

            const {user: user2} = await otherUser.json();
            setOtherMember(user2);

            const conversation = await getOrCreateFriendConversation(currentMember?._id, otherMember?._id);

            if(!conversation){
              redirect(`/user/${params?.userId}/friends`);
            }

            setGconversation(conversation);
          }
          catch(error){
            console.error(error);
          }
        };

        fetchData();
      }, [session, router, serverUpdated]);

    return (
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      {otherMember && (<ChatHeader 
        imageUrl={otherMember.imageUrl}
        name={otherMember.displayname}
        type="conversation"
        email={session?.user?.email}
      />)}

      { otherMember && currentMember && (<ChatMessages
          member={currentMember}
          otherMember={otherMember}
          name={otherMember?.displayname}
          chatId={gconversation?._id}
          apiUrl="/api/direct-messages"
          socketUrl="/api/socket/direct-messages"
          socketQuery={{
            conversationId: gconversation?._id,
            userId: currentMember?._id,
            otherUserId: otherMember?._id,
          }}
          paramKey="conversationId"
          paramValue={gconversation?._id}
          type="conversation"
        />
      )}

      {gconversation && (<ChatInput 
        apiUrl="/api/socket/direct-messages"
        query={{
            conversationId: gconversation?._id,
            userId: currentMember?._id,
            otherUserId: otherMember?._id,
          }}
        name={otherMember?.displayname}
        type="conversation"
        chatId= {gconversation?._id}
      />)}
    </div>
    );
  }
  
  export default MemberIdPage;