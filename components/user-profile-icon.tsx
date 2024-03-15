import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";


interface UserProfileProps {
    src?: string;
    className?: string;
    user?: any;
};

export const UserProfile = ({
    src,
    className,
    user
}: UserProfileProps) =>{
    const {onOpen} = useModal();
    return (
        <Avatar onClick={() => onOpen("editUser", {user})} className={cn(
            "h-7 w-7 md:h-10 md:w-10",
            className
        )}>
            <AvatarImage src={src} />
        </Avatar>
    )
}