"use client";

import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { useServerState } from "@/components/providers/server-provider";


interface ChannelIdPageProps {
  params:{
    serverId: string;
    channelId: string; 
  }
}

const ChannelIdPage = ({params}: ChannelIdPageProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [gchannel, setGchannel] = useState(null);
  const [gmember, setGmember] = useState(null);
  const [user, setUser] = useState(null);
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
          setUser(user);

          const channelfind = await fetch(`/api/channels/fetchChannel`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              },
              body: JSON.stringify({ channelId: params.channelId }),
            });

            const channel = await channelfind.json();

            const memberfind = await fetch(`/api/channels/fetchMember`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ serverId: params.serverId, userId: user._id }),
              });

              const member = await memberfind.json();

              if(!channel || !member){
                redirect("/");
              }

              setGchannel(channel);
              setGmember(member);

      }
      catch(err){
        console.log(err);
      }

    }

    fetchData();

  }, [session, router, serverUpdated]);

    return (
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      { gchannel && (<ChatHeader 
        serverId={gchannel?.serverId}
        name={gchannel?.name}
        type="channel"
        email={session?.user?.email}
        chatId={gchannel?._id}
      />) }

      { gchannel && gmember && (<ChatMessages 
          name={gchannel?.name}
          member={gmember}
          chatId={gchannel?._id}
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{
            channelId: gchannel?._id,
            serverId: gchannel?.serverId,
            memberId: gmember?._id,
            userId: user?._id,
          }}
          paramKey="channelId"
          paramValue={gchannel?.channelId}
          type="channel"
        />
      )}

      {gchannel && (<ChatInput 
        apiUrl="/api/socket/messages"
        query={{
            channelId: gchannel?._id,
            serverId: gchannel?.serverId,
            userId: user?._id,
          }}
        name={gchannel?.name}
        type="channel"
        chatId= {gchannel?._id}
      />)}
    </div>
    )
}

export default ChannelIdPage;
