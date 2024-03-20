"use client";

import React, { use } from 'react'
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrCreateConversation } from '@/lib/conversation';
import { ChatHeader } from '@/components/chat/chat-header';

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
            setCurrentMember(currentMember);

            if(!currentMember){
              redirect("/");
            }

            const conversation = await getOrCreateConversation(currentMember._id, params.memberId);

            if(!conversation){
              redirect(`/servers/${params.serverId}`);
            }

            const {memberOneId, memberTwoId} = conversation;

            const otherMember = memberOneId.userId._id === user._id ? memberTwoId : memberOneId;
            setOtherMember(otherMember);
          }
          catch(error){
            console.error(error);
          }
        };

        fetchData();
      }, [session, router]);

    return (
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      {otherMember && (<ChatHeader 
        imageUrl={otherMember.userId.imageUrl}
        serverId={params.serverId}
        name={otherMember.userId.displayname}
        type="conversation"
        email={session?.user?.email}
      />)}
    </div>
    );
  }
  
  export default MemberIdPage;