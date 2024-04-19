import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";
import { ActionTooltip } from "@/components/action-tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, UserPlus, Settings, Users, PlusCircle, Trash, LogOut } from 'lucide-react';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserProfileProps {
    src?: string;
    user?: any;
};

export const UserProfile = ({
    src,
    user
}: UserProfileProps) => {
    const { onOpen } = useModal();
    const router = useRouter();
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none" asChild>
                    <button>
                        <ActionTooltip side="right"
                            align="center"
                            label={user?.username}>
                            <Avatar className={cn("h-7 w-7 md:h-10 md:w-10")}>
                                <AvatarImage src={src} />
                            </Avatar>
                        </ActionTooltip >
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">

                    <DropdownMenuItem
                        onClick={() => onOpen("editUser", { user })}
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                    >
                        Edit Profile
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => { router.refresh(); signOut({ callbackUrl: '/login' }); }}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        Log Out
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>

                </DropdownMenuContent>

            </DropdownMenu>

        </>

    )
}