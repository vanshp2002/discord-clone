"use client";

import {ChatWelcome} from "@/components/chat/chat-welcome";
import { Loader2, ServerCrash } from "lucide-react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Fragment } from "react";


interface ChatMessagesProps {
    name: string;
    member: any;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
        socketQuery,
        channelId: chatId,
    });

    if (status === "pending") {
        return (
          <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Loading messages...
            </p>
          </div>
        )
      }

      if (status === "error") {
        return (
          <div className="flex flex-col flex-1 justify-center items-center">
            <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Something went wrong!
            </p>
          </div>
        )
      }

    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
                <ChatWelcome name={name} type={type} />

            <div className="flex flex-col-reverse mt-auto">
                {data?.pages.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message) => (
                            <div key={message._id}>
                                {message.content}
                            </div>
                        ))}
                    </Fragment>
                ))}
                </div>
        </div>
    );
}