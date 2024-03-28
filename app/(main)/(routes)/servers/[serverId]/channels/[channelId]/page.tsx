  "use client";
  import React from 'react'
  import { useSession } from "next-auth/react";
  import { useRouter } from "next/navigation";
  import { useEffect, useState } from "react";
  import ChatHeader from '@/components/chat/chat-header';
  import { ChatInput } from '@/components/chat/chat-input';
  import { ChatMessages } from '@/components/chat/chat-messages';
  import { useSharedState } from '@/components/providers/reply-provider';
  import {Button} from "@/components/ui/button"
  import { Input } from "@/components/ui/input"


  interface ChannelIdPageProps {
    params: {
      serverId: string;
      channelId: string;
    }
  }

  const ChannelIdPage = ({ params }: ChannelIdPageProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [gchannel, setGchannel] = useState(null);
    const [gmember, setGmember] = useState(null);
    const [guser, setGuser] = useState(null);
    const { replyMessage, setReplyMessage } = useSharedState("$"); 
    const handleClose = () => {
      setReplyMessage("$");
    }
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
          setGuser(user);
          const getchannel = await fetch("/api/channels/getchannelid", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              channelId: params.channelId
            })
          });

          const { channel } = await getchannel.json();
          setGchannel(channel);
          console.log(gchannel);
          const getmember = await fetch("/api/members/getmemberid", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              serverId: params.serverId,
              userId: user._id
            })
          });

          const { member } = await getmember.json();
          setGmember(member);

          if (!channel || !member) {
            return router.push("/");
          }

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();

    }, [session, router]);

    return (
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        {gchannel && (<ChatHeader
          serverId={gchannel?.serverId}
          name={gchannel?.name}
          type="channel"
          email={session?.user?.email}
        />)}
        
        {gchannel && gmember && (<ChatMessages
          name={gchannel?.name}
          member={gmember}
          chatId={gchannel?._id}
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{
            channelId: gchannel?._id,
            serverId: gchannel?.serverId,
            memberId: gmember?._id,
            userId: guser?._id,
          }}
          paramKey="channelId"
          paramValue={gchannel?.channelId}
          type="channel"
        />
        )}
        
        {replyMessage !=="$" &&   
          <div className="flex">
             <Input 
              className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black dark:text-white"
              placeholder={`${replyMessage?.name}-->${replyMessage?.content}`} disabled/>
             <Button onClick={handleClose}>Click</Button>
          </div>
        }

        {replyMessage && gchannel && (<ChatInput
          apiUrl="/api/socket/messages"
          query={{
            channelId: gchannel?._id,
            serverId: gchannel?.serverId,
            userId: guser?._id,
            reply: replyMessage?.content
          }}
          name={gchannel?.name}
          type="channel"
        />)}
      </div>
    )
  }

  export default ChannelIdPage