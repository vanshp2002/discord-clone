
import { currentProfile } from "@/lib/current-profile";
import { set } from "mongoose";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { NavigationAction } from "@/components/navigation/navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";

export const NavigationSidebar = ({email}) => {

    const [server, setServer] = useState([]);

    useEffect (() => {

        const fetchData = async () => {

                const res = await fetch("/api/fetchUserProfile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                    }),
                });
                const { user } = await res.json();

                const servers = await fetch("/api/findAllServers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        profileId: user?._id.toString(),
                    }),
                });
                const { foundServers } = await servers.json();
                // console.log("Hi", servers);
                setServer(foundServers);
        }

        fetchData();
    }, [email]);


    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
            <NavigationAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                {
                    server.map((server) => (
                        <div key={server._id} className="mb-4">
                            <NavigationItem 
                                id={server._id}
                                name={server.name}
                                imageUrl={server.imageUrl}/>
                        </div>
                    ))
                }
            </ScrollArea>
        </div>
    )
}