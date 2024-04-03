"use client";

import React from 'react'
import FriendSidebar from '@/components/friend/friend-sidebar';

const ServerIdLayout = ({
    children,
    params,
}: {
    children: React.ReactNode;
    param: { userId: string };
}) => {

    return (
        <>
            <div className="h-full">
                <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                    <FriendSidebar />
                </div>
                <main className="h-full md:pl-60">
                    {children}
                </main>
            </div>
        </>
    )
}

export default ServerIdLayout