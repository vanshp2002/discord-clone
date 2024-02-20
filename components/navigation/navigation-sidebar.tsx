"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavigationAction } from './navigation-action';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavigationItem } from '@/components/navigation/navigation-item';
import {ModeToggle} from "@/components/mode-toggle"

export const NavigationSidebar =  () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [servers, setServers] = useState([]);
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

                if(!userfind){
                    router.push("/");
                }
                const user  = await userfind.json();
                const allServers = await fetch("/api/servers/getallservers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user._id,
                    })
                });
                const toJson = await allServers.json();
                setServers(toJson.server)

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, [session, router]);


    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
            <NavigationAction/>
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10"
            />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div key = {server._id} className="mb-4 text-white">
                        <NavigationItem
                            name={server?.name}
                            imageUrl={server?.imageUrl}
                            id={server?._id}
                        >
                        </NavigationItem>
                    </div>
                ))}
            </ScrollArea>   
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle/>
            </div>                     
        </div>
    )
}