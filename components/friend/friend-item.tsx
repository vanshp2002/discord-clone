import { useState } from "react";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { MessageCircle } from "lucide-react";
import { RxCross1 } from "react-icons/rx";
import { TbMessageCircle2Filled } from "react-icons/tb";

interface FriendItemProps {
    friend?: any,
    userId?: string,
    onRemoveFriend: (id: string) => void
}

const FriendItem = ({
    friend,
    userId,
    onRemoveFriend
}: FriendItemProps) => {

    const [isHovered, setIsHovered] = useState(false);
    const otherUser = friend.userOneId._id === userId ? friend.userTwoId : friend.userOneId;

    return (
        <div key={friend._id} className="p-3.5 flex justify-between gap-x-2 hover:bg-zinc-800/60" style={{ maxWidth: "94%" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                    <div className="flex items-center gap-x-2">
                        <UserAvatar src={otherUser.imageUrl} />
                        <div className="ml-1">
                            <div className="flex items-center gap-x-1">
                                <p className="text font-semibold text-zinc-500 dark:text-zinc-400 text-[16px]">{otherUser.displayname}</p>
                                {isHovered && <div className="ml-1.5 mt-1.3 text-[15px] text-zinc-500 dark:text-zinc-400"> @{otherUser.username} </div>}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-x-4 mr-5">
                        <ActionTooltip label="Message" side='top'>
                            <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                <TbMessageCircle2Filled className="stroke-1 text-zinc-200 text-sm h-6 w-6 md:h-6 md:w-6" />
                            </div>
                        </ActionTooltip>
                        <ActionTooltip label="Remove Friend" side='top'>
                            <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                <RxCross1 onClick={() => onRemoveFriend(friend._id)} className="text-zinc-200 text-sm h-4 w-4 md:h-5 md:w-5 hover:text-red-500" />
                            </div>
                        </ActionTooltip>
                    </div>
        </div>
    )
}

export default FriendItem