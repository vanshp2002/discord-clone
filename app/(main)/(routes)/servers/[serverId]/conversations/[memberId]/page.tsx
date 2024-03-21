"use client";

import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatHeader from '@/components/chat/chat-header';

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  }
}

const MemberIdPage = ({
  params
}: MemberIdPageProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [gchannel, setGchannel] = useState(null);
  const [gmember, setGmember] = useState(null);
  const [otherMem, setOtherMem] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userfind = await fetch("/api/fetchuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session?.user?.email,
          }),
        });
        const user = await userfind.json();
        if (!user) {
          router.push("/login");
        }
        const currentmember = await fetch("/api/servers/getmemberdata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serverId: params.serverId,
            userId: user._id
          }),
        })

        const { member } = await currentmember.json();

        if (!member) {
          return router.push("/");
        }

        const con = await fetch("/api/conversations/getorcreateconversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberOneId: member._id,
            memberTwoId: params.memberId
          }),
        })

        const { conversation } = await con.json();  

        if(!conversation){
          return router.push(`/servers/${params.serverId}`);
        }
        console.log(conversation);

        const {memberOneId, memberTwoId} = await conversation;
        
        const otherMember = await memberOneId.userId._id === user._id ? memberTwoId : memberOneId;

        await setOtherMem(otherMember);

      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();

  }, [session, router]);
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      {<ChatHeader imageUrl={otherMem?.userId?.imageUrl} name={otherMem?.userId?.displayname} type="conversation"/>}
    </div>
  )
}

export default MemberIdPage