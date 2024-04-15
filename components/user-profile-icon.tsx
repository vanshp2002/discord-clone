import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


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
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className={cn(
                    "h-10 w-10 md:h-10 md:w-10",
                    className
                )}>
                    <AvatarImage src={src} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={20} alignOffset={20} className="w-48 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
                   
                        <DropdownMenuItem
                            onClick={() => onOpen("editUser", { user })}
                            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                        >
                            Edit Profile
                            <Settings className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    
                        <DropdownMenuItem
                            onClick={() => {router.refresh(); signOut({ callbackUrl: '/login' });}}
                            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                        >
                            Log Out
                            <LogOut className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                   
                </DropdownMenuContent>

        </DropdownMenu>
    )
}