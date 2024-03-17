import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";
import { ActionTooltip } from "@/components/action-tooltip";


interface UserProfileProps {
    src?: string;
    user?: any;
};

export const UserProfile = ({
    src,
    user
}: UserProfileProps) => {
    const { onOpen } = useModal();
    return (
        <ActionTooltip side="right"
            align="center"
            label={user?.username}>
        <Avatar onClick={() => onOpen("editUser", {user})} className={cn("h-7 w-7 md:h-10 md:w-10")}>
            <AvatarImage src={src} />
        </Avatar>
        </ActionTooltip >
    )
}