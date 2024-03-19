"use client";

import React from 'react'
import ServerSidebar from '@/components/server/server-sidebar';

const ServerIdLayout = ({
    children,
    params,
}: {
    children: React.ReactNode;
    param: { serverId: string };
}) => {

    return (
        <>
            <div className="h-full">
                <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                    <ServerSidebar serverId={params.serverId.toString()} />
                </div>
                <main className="h-full md:pl-60">
                    {children}
                </main>
            </div>
        </>
    )
}

export default ServerIdLayout