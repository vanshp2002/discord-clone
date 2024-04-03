import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import { Popover, PopoverTrigger } from "./ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useState, useEffect, use } from "react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Edit } from "lucide-react";
import { Input } from "./ui/input";
import { useServerState } from "@/components/providers/server-provider";
import { useRouter } from "next/navigation";
import axios from "axios";
import queryString from "query-string";

interface UserCardAvatarProps {
    user: any;
    currentUserId: string;
    chatId: string;
    className?: string;
    classNameCard?: string;
    isHovered: boolean;
};

export const UserCardAvatar = ({
    user,
    currentUserId,
    chatId,
    className,
    classNameCard,
    isHovered
}: UserCardAvatarProps) =>{
    const [shouldShow, setShouldShow] = useState(false);

    const [editHovered, setEditHovered] = useState(false);

    const [editing, setEditing] = useState(false);
    const[note, setNote] = useState(user?.note);
    const { serverUpdated, setServerUpdated } = useServerState();
    const router = useRouter();

    const isOwner = user._id === currentUserId;

    useEffect(() => {
        if(!isHovered && shouldShow){
            setShouldShow(false);
            setEditing(false);
        }

    }, [isHovered]);

    const handleOpenChange = () => {
        setShouldShow(!shouldShow);
    }

    const updateNote = async (value: string) => {
        const res = await fetch("/api/editNote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user._id,
                    note: value,
                    chatId,
                    }),
                });
        const {user:usertemp} = await res.json();

        // const url = queryString.stringifyUrl({
        //     url: "/api/editNote",
        //     query: {
        //         userId: user._id,
        //         note: value,
        //     },
        // });

        // const res = await axios.post(url);

        // const usertemp = await res.data.user;
        setEditing(false);
        setNote(usertemp.note);
        setServerUpdated((prevServerUpdated: any) => prevServerUpdated + 1);
        router.refresh();
        user = usertemp;
    };

    // useEffect(() => {
    //     if(!editing){
    //         updateNote();
    //     }
    // }, [editing]);

    return (
        <Popover open={shouldShow} onOpenChange={handleOpenChange}>
            <PopoverTrigger> 
                <Avatar className={cn(
                    "h-7 w-7 md:h-10 md:w-10",
                    className
                    )}>
                    <AvatarImage src={user?.imageUrl} />
                </Avatar>
            </PopoverTrigger>
            <PopoverContent side="right" hideWhenDetached={true} style={{ zIndex: 1 }}>
            <Card className={cn("w-[380px] bg-zinc-800", classNameCard)} >
                <CardHeader className="bg-zinc-800 p-4">
                <Avatar className={cn(
                        "ml-5 mt-4 h-14 w-14 md:h-14.5 md:w-14.5",
                        className
                        )}>
                        <AvatarImage src={user?.imageUrl} />
                    </Avatar>
                    <CardTitle className="ml-5 py-1">
                        {user?.displayname}
                    </CardTitle>
                    <CardDescription className="ml-5">
                        @{user?.username}
                    </CardDescription>
                </CardHeader>
                <CardContent className="ml-4 mr-4 mb-3 pt-4 bg-black" style={{ borderRadius: '1rem' }}>
                    <p className="font-semibold text-sm">DISCORD MEMBER SINCE</p>
                    <p className="text-gray-400 text-xs mt-1">{user?.createdAt && user?.createdAt.substring(0, 10)}</p>
                    {/* <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-auto mx-auto mt-2" /> */}

                    <div className="flex items-center justify-between" onMouseEnter={() => setEditHovered(true)} onMouseLeave={() => setEditHovered(false)}>
                        <p className="font-semibold mt-3 text-sm">NOTE</p>
                            {isOwner && <Edit onClick={() => setEditing(!editing)} className={`h-4 w-4 text-zinc-500 dark:text-zinc-400 mt-3 ${editHovered ? 'flex' : 'hidden'}`} />}
                        </div>
                    {!editing ? (
                        <p className="text-gray-400 text-xs mt-1">{note}</p>
                    ) : (
                        <form>
                        <Input className="text-gray-400 text-xs mt-1 bg-inherit" placeholder="Add a note" defaultValue={note}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              updateNote(e.currentTarget.value); 
                            }
                          }}
                        />
                        </form>
                        )}
                </CardContent>
                </Card>
            </PopoverContent>
        </Popover> 
    )
}