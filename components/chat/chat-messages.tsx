"use client";

import {ChatWelcome} from "@/components/chat/chat-welcome";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { Loader2, ServerCrash } from "lucide-react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { Fragment, useRef, ElementRef, useEffect } from "react";
import { ChatItem } from "./chat-item";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { set } from "mongoose";

const DATE_FORMAT = "d MMM yyyy, HH:mm";


interface ChatMessagesProps {
    name: string;
    member: any;
    otherMember: any;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

function fetchData(useChatQuery: any, queryKey: any, apiUrl: any, paramKey: any, paramValue: any, socketQuery: any, chatId: any, member: any, looping: boolean) {
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;
    
    const { data , fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
        socketQuery,
        channelId: chatId,
    });

    useChatSocket({ queryKey, addKey, updateKey });

    return { data , fetchNextPage, hasNextPage, isFetchingNextPage, status };

}

export const ChatMessages = ({
    name,
    member,
    otherMember,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;
    
    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);

    const [loop, setLoop] = useState(false);
    const router = useRouter();
    // const [data, setData] = useState(null);
    // const [fetchNextPage, setFetchNextPage] = useState();
    // const [hasNextPage, setHasNextPage] = useState(null);
    // const [isFetchingNextPage, setIsFetchingNextPage] = useState(null);
    // const [status, setStatus] = useState(null);
    
    // const { data: fetchedData, fetchNextPage: nextPage, hasNextPage: nextPageStatus, isFetchingNextPage: fetchingStatus, status: fetchStatus } = useChatQuery({
    const { data , fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
      socketQuery,
      channelId: chatId,
      looping: loop,
  });
    // useEffect(() => {
    //     setData(fetchedData);
    //     setFetchNextPage(() => nextPage);
    //     setHasNextPage(nextPageStatus);
    //     setIsFetchingNextPage(fetchingStatus);
    //     setStatus(fetchStatus);
    // }, [fetchStatus]);

    useChatSocket({ queryKey, addKey, updateKey });

    useChatScroll({
      chatRef,
      bottomRef,
      loadMore: fetchNextPage,
      shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
      count: data?.pages?.[0]?.items?.length ?? 0,
      isLatestByOwn: data?.pages?.[0]?.items?.[0]?.memberId._id === member._id,
    })


    const handleReplyClick = async (messageId: string) => {
      await fetchNextPage();
        let messageElement = document.getElementById(messageId);
        // while(!messageElement && hasNextPage) {
        //     console.log("Fetching next page");
        //     messageElement = document.getElementById(messageId);
        // }
          // messageElement = document.getElementById(messageId);
          // const {data: newData, fetchNextPage: newFetchNextPage, hasNextPage: newHasNextPage, isFetchingNextPage: newIsFetchingNextPage, status: newStatus} = fetchData(useChatQuery, queryKey, apiUrl, paramKey, paramValue, socketQuery, chatId, member, true);
          // setData(newData);
          // setFetchNextPage(() => newFetchNextPage);
          // setHasNextPage(newHasNextPage);
          // setIsFetchingNextPage(newIsFetchingNextPage);
          // setStatus(newStatus);
        // }
        // setLoop(false);

        if (messageElement) {
          messageElement.scrollIntoView({ behavior: "smooth", block: "center"});
        } else {
          console.log("Message not found");
        }
      }

// --------------------------------------------------------------------------------



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
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
            {!hasNextPage && <div className="flex-1" />}
                { !hasNextPage && <ChatWelcome name={name} type={type} username={otherMember?.username} src={otherMember?.imageUrl} />
                }

        {hasNextPage && (
          <div className="flex justify-center">
            {isFetchingNextPage ? (
              <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
            ) : (
              <button
                onClick={() => fetchNextPage()}
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
              >
                Load previous messages
              </button>
            )}
          </div>
        )}

            <div className="flex flex-col-reverse mt-auto">
                {data?.pages.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message) => (
                            <ChatItem 
                              type={type}
                              key={message._id}
                              message={message}
                              id={message._id}
                              reply={message?.reply}
                              currentMember={member}
                              member={message.memberId}
                              content = {message.content}
                              deleted={message.deleted}
                              reactions={message?.reactions}
                              fileUrl={message.fileUrl}
                              timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                              isUpdated={message?.edited}
                              socketUrl={socketUrl}
                              socketQuery={socketQuery}
                              onReplyClick={handleReplyClick}
                            />
                        ))}
                    </Fragment>
                ))}
                </div>
                <div ref={bottomRef} />
        </div>
    );
}