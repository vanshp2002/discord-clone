import { FaBan } from "react-icons/fa6";
import { ActionToolTip } from "../ui/action-tooltip";
import { UserAvatar } from "../user-avatar";
import { useState } from "react";
import { IoPersonAddSharp } from "react-icons/io5";

interface FriendItemBlockedProps {
    friend?: any,
    userId?: string,
    onUnblockFriend: (id: string) => void
}

const FriendItemBlocked = ({
    friend,
    userId,
    onUnblockFriend
}: FriendItemBlockedProps) => {

    const [isHovered, setIsHovered] = useState(false);
    const otherUser = friend.userOneId._id === userId ? friend.userTwoId : friend.userOneId;

    return (
        <>

        <div className="p-3.5 flex justify-between gap-x-2 hover:bg-zinc-800/60" style={{ maxWidth: "94%" }}
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
                        <ActionToolTip label="Unblock" side='top'>
                            <div className="flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                <IoPersonAddSharp onClick={() => onUnblockFriend(friend._id)} className="text-gray-300 h-4 w-4 md:h-5 md:w-5 hover:text-green-500" />
                            </div>
                        </ActionToolTip>
                    </div>
        </div>
        
        </>
    )
}

export default FriendItemBlocked;