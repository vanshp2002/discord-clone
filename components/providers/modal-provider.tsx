"use client";

import { CreateServerModal } from '@/components/modals/create-server-modal';
import { CreateChannelModal } from '@/components/modals/create-channel-modal';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { EditServerModal } from '@/components/modals/edit-server-modal';
import {InviteModal} from '@/components/modals/invite-modal';
import { MembersModal } from '@/components/modals/members-modal';
import { UserModal } from '@/components/modals/user-profile-modal';
import { LeaveServerModal } from './../modals/leave-server-modal';
import { DeleteServerModal } from './../modals/delete-server-modal';
import { DeleteChannelModal } from './../modals/delete-channel-modal';
import EditChannelModal from '../modals/edit-channel-modal';

export const ModalProvider = () => {

    const { data: session } = useSession();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted){
        return null;
    }
    
    return (
        <>
            <CreateServerModal email={session?.user?.email}/>
            <InviteModal email={session?.user?.email}/>
            <EditServerModal email={session?.user?.email}/>
            <MembersModal email={session?.user?.email}/>
            <UserModal />
            <CreateChannelModal email={session?.user?.email}/>
            <LeaveServerModal email={session?.user?.email}/>
            <DeleteServerModal email={session?.user?.email}/>
            <DeleteChannelModal email={session?.user?.email}/>
            <EditChannelModal email={session?.user?.email}/>                        
        </>
    )
}
