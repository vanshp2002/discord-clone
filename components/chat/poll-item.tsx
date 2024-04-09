import { ActionTooltip } from "../action-tooltip";
import { UserAvatar } from "../user-avatar";
import { UserCardAvatar } from "../user-card-avatar";

interface PollItemProps {
    id: string;
    poll: any;
    query: Record<string, any>;
    onVote?: () => void;
    member: any;
    onMemberClick: () => void;
}

export const PollItem = ({
    id,
    poll,
    query,
    onVote,
    member,
    onMemberClick,
}: PollItemProps) => {

    return (

        <>

            <div id={id} className="relative group items-center hover:bg-black/5 p-4 transition w-full">

                <div className="group flex gap-x-2 items-start w-full">
                    <div className="cursor-pointer">
                        {/* {member && <UserCardAvatar user={member?.userId} currentUserId={currentMember.userId._id} chatId={chatId} isHovered={isHovered} />} */}
                        <UserAvatar src={member?.userId?.avatar} className="h-8 w-8 md:h-8 md:w-8" />
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-x-2">
                            <div className="flex items-center">
                                <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                                    {member?.userId?.displayname}
                                </p>
                                <ActionTooltip label={member.role}>
                                    {roleIconMap[member.role]}
                                </ActionTooltip>
                            </div>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {timestamp}
                            </span>
                        </div>

                    </div>
                </div>
            </div>

        </>

    )
}