"use client";

import { CreateServerModal } from '@/components/modals/create-server-modal';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import InviteModal from '@/components/modals/invite-modal';

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
        </>
    )
}
