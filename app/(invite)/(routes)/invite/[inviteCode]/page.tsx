"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { NavigationSidebar } from './../../../../../components/navigation/navigation-sidebar';

interface InvitecodePageProps {
    params: {
        inviteCode: string;
    }
}
const InviteCodePage = ({
    params
}: InvitecodePageProps) => {
    const { data: session } = useSession();
    const [dataFetched, setDataFetched] = useState(false);
    useState
    const router = useRouter();
    let flag=false;
    useEffect(() => {
        if (!dataFetched && session) {
            const fetchData = async () => {
                try {
                    // Fetch data only if it hasn't been fetched before and session is available
                    const userfind = await fetch("/api/fetchuser", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: session.user.email,
                        }),
                    });
                    const user = await userfind.json();
                    console.log(user);
                    setDataFetched(true); // Mark data as fetched

                    const server = await fetch("/api/servers/ismember", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: user._id,
                            inviteCode: params.inviteCode
                        }),
                    });
                    const serverJson = await server.json();
                    if (serverJson.server) {
                        return router.push(`/servers/${serverJson.server._id}`);
                    }

                    const serverUpdated = await fetch("/api/servers/addmembertoserver", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: user._id,
                            inviteCode: params.inviteCode
                        }),

                    })
                    const serverUpdatedJson = await serverUpdated.json();
                    console.log(serverUpdatedJson.server)
                    flag=true
                    return router.push(`/servers/${serverUpdatedJson.server._id}`);                    

                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [session, dataFetched]); // Run the effect when session or dataFetched changes

    return (
        <>
            {flag && <NavigationSidebar/>}
        </>
    );
};

export default InviteCodePage;
