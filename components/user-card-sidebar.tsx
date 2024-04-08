import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { UserAvatar } from "./user-avatar";
import { useState } from "react";

interface UserCardSidebarProps {
    user: any,
    mutualFriends: any
}

function formatDate(timestamp: any) {
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

const UserCardSidebar = ({
    user,
    mutualFriends
}: UserCardSidebarProps) => {

    const [isMutualFriendsOpen, setIsMutualFriendsOpen] = useState(false);

    const formattedDate = formatDate(user?.createdAt);
    return (
        <>

            <Card className="h-full w-full bg-zinc-800" >
                <CardHeader className="bg-zinc-800 p-0">
                <div style={{ position: "relative", display: "inline-block" }}>
                    <div className=" h-[145px]" style={{ position: "absolute", top: 0, left: 0, width: "100%", backgroundColor: user?.bannerColor }} />
                    <div className=" flex items-center ml-9 mt-24 bg-zinc-800" style={{ position: "relative", zIndex: 0, display: "inline-block", borderRadius: "75%", overflow: "hidden", width:"96px", height:"90px" }}>
                            <Avatar className= "ml-2 mt-2 h-20 w-20 md:h-20 md:w-20" style={{ position: "relative" }}>
                                <AvatarImage src={user?.imageUrl} />
                            </Avatar>
                    </div>
                </div>
                    <CardTitle className="ml-9 py-1">
                        {user?.displayname}
                    </CardTitle>
                    <CardDescription className="ml-9">
                        @{user?.username}
                    </CardDescription>
                </CardHeader>
                <CardContent className="ml-2.5 mr-2.5 mb-3 pt-4 mt-4" >
                    <div className=" p-4 bg-black" style={{ borderRadius: '1rem' }}>

                    <p className="font-semibold text-sm">DISCORD MEMBER SINCE</p>
                    <p className="text-gray-400 text-xs mt-1.5">{formattedDate}</p>

                    <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mt-4" style={{ maxWidth: "98%" }}/>

                    <div className="flex items-center justify-between">
                        <p className="font-semibold mt-3 text-sm">NOTE</p>
                    </div>

                    <p className="text-gray-400 text-xs mt-1">{user?.note}</p>

                    </div>

                    <div className="bg-black mt-5 p-4" style={{ borderRadius: '1rem' }}>

                    {/* <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mt-4" style={{ maxWidth: "98%" }}/> */}

                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">MUTUAL FRIENDS</p>
                            
                        <div className="flex items-center">

                        {mutualFriends && <p className="text-gray-400 font-semibold text-xs mr-3 "> {mutualFriends.length} </p>}

                        {mutualFriends && <div className="flex items-center justify-center w-6 h-6 rounded-full cursor-pointer" onClick={() => setIsMutualFriendsOpen(!isMutualFriendsOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMutualFriendsOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                )}
                            </svg>
                        </div>}


                        </div>
                    </div>
                    

                    { isMutualFriendsOpen && 

                        <ScrollArea className="mt-2 p-1 flex-grow" style={{ maxHeight: "200px", borderRadius: '0.5rem' }}>
                            {mutualFriends.map((friend: any) => (
                                <div className="bg-zinc-800 flex items-center gap-x-2 mt-1 p-2">
                                    <UserAvatar src={friend.imageUrl} className="h-6 w-6 md:h-6 md:w-6" />
                                    <div>
                                        <p className="ml-3 text-gray-400 text-xs">{friend.displayname}</p>
                                        <p className="ml-3 text-gray-400 text-xs">@{friend.username}</p>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>

                    }
                    
                    </div>

                </CardContent>
                </Card>

        </>
    )
}

export default UserCardSidebar;