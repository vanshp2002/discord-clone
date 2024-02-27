"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
        </>
    )
}