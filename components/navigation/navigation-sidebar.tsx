
import { currentProfile } from "@/lib/current-profile";
import { set } from "mongoose";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { NavigationAction } from "@/components/navigation/navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { UserProfile } from "@/components/user-profile-icon";

export const NavigationSidebar = ({email}) => {

    const [userdata,setUserdata] = useState(null);
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
                const user  = await res.json();
                setUserdata(user);

                const servers = await fetch("/api/servers/getServers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user?._id,
                    }),
                });
                const { foundServers } = await servers.json();
                setServer(foundServers);
        }

        fetchData();
    }, [email]);


    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
            <NavigationAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
           {server && ( <ScrollArea className="flex-1 w-full">
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
            </ScrollArea>)}
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            
            {userdata && 
            
                <div className="flex items-center justify-center w-10 h-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                    <UserProfile src={userdata?.imageUrl} user={userdata} />
                </div>
            }

        </div>
    )
}