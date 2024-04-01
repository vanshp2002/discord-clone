"use client";

import React, { use } from 'react'
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrCreateConversation } from '@/lib/conversation';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { useServerState } from "@/components/providers/server-provider";

interface MemberIdPageProps {
  params:{
    serverId: string;
    memberId: string; 
  }
}


const MemberIdPage = ({
  params
}: MemberIdPageProps) => {

  const { data: session } = useSession();
  const router = useRouter();
  const [currentMember, setCurrentMember] = useState(null);
  const [otherMember, setOtherMember] = useState(null);
  const [gconversation, setGconversation] = useState(null);
  const { serverUpdated, setServerUpdated } = useServerState();

  useEffect(() => {
    const fetchData = async () => {
      try{
          const userfind = await fetch(`/api/fetchUserProfile`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: session?.user?.email }),
            });

            const user = await userfind.json();
            setCurrentMember(user);
            
            const memberfind = await fetch(`/api/channels/fetchMember`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                serverId: params.serverId,
                userId: user._id,
              }),
            });

            const currentMember = await memberfind.json();
            // setCurrentMember(currentMember);

            if(!currentMember){
              redirect("/");
            }

            const conversation = await getOrCreateConversation(currentMember._id, params.memberId);

            if(!conversation){
              redirect(`/servers/${params.serverId}`);
            }

            setGconversation(conversation);

            const {memberOneId, memberTwoId} = conversation;

            const otherMember = memberOneId._id === user._id ? memberTwoId : memberOneId;
            setOtherMember(otherMember);
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
        serverId={params.serverId}
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