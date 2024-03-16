"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { Edit, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { EditServerModal } from "../modals/edit-server-modal";
import { MembersModal } from "../modals/members-modal";
import { UserModal } from "../modals/user-profile-modal";
import { CreateChannelModal } from "../modals/create-channel-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted)
        return null;

    return (
        <>
            <CreateServerModal email={session?.user?.email}/>
            <InviteModal />
            <EditServerModal email={session?.user?.email}/>
            <MembersModal />
            <UserModal />
            <CreateChannelModal email={session?.user?.email} />
        </>
    )
}