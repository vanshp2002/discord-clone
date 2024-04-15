import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  socketQuery: Record<string, string>;
    channelId: string;
    looping: boolean;
};

export const useChatQuery = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
    socketQuery,
    channelId,
    looping,
  }: ChatQueryProps) => {

    const { isConnected } = useSocket();

    const fetchMessages = async ({ pageParam = undefined }) => {
        const url = qs.stringifyUrl({
        url: apiUrl,
        query: {
            // ...socketQuery,
            // channelId,
            cursor: pageParam,
            [paramKey]: paramValue,
        }
        }, { skipNull: true });

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify({
                cursor: pageParam,
                [paramKey]: paramValue,
                channelId,
                userId: socketQuery.userId,
            }),
            });
        return res.json();
    }

    const {
            data,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            status,
        } = useInfiniteQuery({
            queryKey: [queryKey],
            queryFn: fetchMessages,
            getNextPageParam: (lastPage) => lastPage?.nextCursor,
            refetchInterval: isConnected ? false : 1000,
            initialPageParam: undefined, // Add this line
        });
    
    if(looping) {
        fetchNextPage();
    }
    
      return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
      };
};