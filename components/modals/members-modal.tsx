"use client";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { on } from "events";
import { useRouter } from "next/navigation";

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
};

export const MembersModal = () => {
    const {onOpen, isOpen, type, data} = useModal();
    const [loadingId, setLoadingId] = useState("");
    const router = useRouter();

    const isModalOpen = isOpen && type === "members";
    const {server} = data;
    console.log(server);

    const onClose = () => {
        window.location.reload();
    }

    const onRoleChange = async (role: string, userId: string, memberId: string) => {
        try {
            setLoadingId(userId);
            console.log(role, userId);
            const res: Response = await fetch("/api/servers/members/changerole", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    serverId: server._id,
                    memberId,
                    userId,
                    role,
                })
            });
            const NewServer = await res.json();
            router.refresh();
            onOpen("members", {server: NewServer.server});
            // window.location.reload();
        } catch (error) {
            console.log(error);
        }finally{
            setLoadingId("");
        }
    };

    const onKick = async (userId: string, memberId: string) => {
        try {
            setLoadingId(userId);
            const res: Response = await fetch("/api/servers/members/kick", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    serverId: server._id,
                    memberId,
                    userId,
                })
            });
            const NewServer = await res.json();
            router.refresh();
            onOpen("members", {server: NewServer.server});
            // window.location.reload();
        } catch (error) {
            console.log(error);
        }finally{
            setLoadingId("");
        }
    }
    
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle> 
                    <DialogDescription className="text-center text-zinc-500">
                            {server?.newmembers.length} Members
                    </DialogDescription>                
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div key={member.userId} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.userId.imageUrl}/>
                            <div className="flex flex-col gap-y-1">
                            <div className="text-xs font-semibold flex items-center gap-x-1">
                                {member.userId.username}
                                {roleIconMap[member.role]}
                            </div>
                            <p className="text-xs text-zinc-500"> 
                                {member.userId.email}
                            </p>
                        </div>
                        {server.userId !== member.userId._id && loadingId !== member.userId._id && (
                            <div className="ml-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="left">
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger 
                                                className="flex items-center"
                                            >
                                                <ShieldQuestion 
                                                    className="w-4 h-4 mr-2"
                                                />
                                                <span>Role</span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>

                                                    <DropdownMenuItem
                                                        onClick={() => onRoleChange("GUEST", member.userId._id, member._id)}
                                                    >
                                                        <Shield className="h-4 w-4 mr-2"/>
                                                        Guest
                                                        {member.role === "GUEST" && (
                                                            <Check className="h-4 w-4 ml-auto"/>
                                                        )}
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => onRoleChange("MODERATOR", member.userId._id, member._id)}
                                                    >
                                                        <ShieldCheck className="h-4 w-4 mr-2"/>
                                                        Moderator
                                                        {member.role === "MODERATOR" && (
                                                            <Check className="h-4 w-4 ml-auto"/>
                                                        )}
                                                    </DropdownMenuItem>

                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onKick(member.userId._id, member._id)}>
                                            <Gavel className="h-4 w-4 mr-2"/>
                                            Kick
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            )}
                            {loadingId === member.userId._id && (
                                <Loader2
                                    className="h-4 w-4 ml-auto animate-spin text-zinc-500" 
                                />
                            )}
                    </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}