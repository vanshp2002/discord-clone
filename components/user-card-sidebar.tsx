import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface UserCardSidebarProps {
    user: any,
    mutualFriends?: any
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
                <CardContent className="ml-4 mr-4 mb-3 pt-4 mt-4 bg-black" style={{ borderRadius: '1rem' }}>
                    <p className="font-semibold text-sm">DISCORD MEMBER SINCE</p>
                    <p className="text-gray-400 text-xs mt-1.5">{formattedDate}</p>

                    <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mt-4" style={{ maxWidth: "98%" }}/>

                    <div className="flex items-center justify-between">
                        <p className="font-semibold mt-3 text-sm">NOTE</p>
                    </div>

                    <p className="text-gray-400 text-xs mt-1">{user?.note}</p>

                    <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mt-4" style={{ maxWidth: "98%" }}/>

                    <div className="flex items-center justify-between">
                        <p className="font-semibold mt-3 text-sm">MUTUAL FRIENDS</p>
                        {mutualFriends && <p className="text-gray-400 text-xs mt-1">{mutualFriends.length}</p>}
                        {mutualFriends && mutualFriends.map((friend: any) => (
                            <div className="flex items-center gap-x-2 mt-1">
                                <p className="text-gray-400 text-xs">{friend.displayname}</p>
                            </div>
                        ))}
                    </div>

                </CardContent>
                </Card>

        </>
    )
}

export default UserCardSidebar;