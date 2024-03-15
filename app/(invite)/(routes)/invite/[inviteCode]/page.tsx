"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface InvitecodePageProps {
    params: {
        inviteCode: string;
    }
}
const InviteCodePage = ({
    params
}: InvitecodePageProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (session) {
            const fetchData = async () => {
                try {
                    // Fetch data only if it hasn't been fetched before and session is available
                    const userfind = await fetch("/api/fetchUserProfile", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: session?.user?.email,
                        }),
                    });
                    const user = await userfind.json();


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
                    return router.push(`/servers/${serverUpdatedJson.server._id}`);                    

                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [session]); // Run the effect when session or dataFetched changes

    return (
        <>
            Redirecting ...
        </>
    );
};

export default InviteCodePage;