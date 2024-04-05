import { useState } from "react";
import { UserAvatar } from "../user-avatar";
import { ActionToolTip } from "../ui/action-tooltip";
import { RxCross1 } from "react-icons/rx";
import { TbMessageCircle2Filled } from "react-icons/tb";
import { FaBan } from "react-icons/fa6";
import {useRouter} from 'next/navigation';

interface FriendItemProps {
    friend?: any,
    userId?: string,
    onRemoveFriend: (id: string) => void,
    onBlockFriend: (id: string) => void
}

const FriendItem = ({
    friend,
    userId,
    onRemoveFriend,
    onBlockFriend
}: FriendItemProps) => {

    const [isHovered, setIsHovered] = useState(false);
    const otherUser = friend.userOneId._id === userId ? friend.userTwoId : friend.userOneId;
    const router = useRouter();

    const onMessageFriend = () => {
        router.push(`/user/${userId}/friends/${otherUser._id}`)
    }


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
                        <ActionToolTip label="Message" side='top'>
                            <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                <TbMessageCircle2Filled onClick={onMessageFriend} className="stroke-1 text-zinc-200 text-sm h-6 w-6 md:h-6 md:w-6" />
                            </div>
                        </ActionToolTip>
                        <ActionToolTip label="Block" side='top'>
                            <div className="flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                <FaBan onClick={() => onBlockFriend(friend._id)} className="text-gray-300 h-4 w-4 md:h-5 md:w-5" />
                            </div>
                        </ActionToolTip>
                        <ActionToolTip label="Remove Friend" side='top'>
                            <div className=" flex justify-center items-center w-10 h-10 md:h-10 md:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-full cursor-pointer">
                                <RxCross1 onClick={() => onRemoveFriend(friend._id)} className="text-zinc-200 text-sm h-4 w-4 md:h-5 md:w-5 hover:text-red-500" />
                            </div>
                        </ActionToolTip>
                    </div>
        </div>
    )
}

export default FriendItem

