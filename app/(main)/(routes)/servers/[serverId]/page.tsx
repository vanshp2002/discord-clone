"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";


const ServerIdPage = () => {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {

    const fetchGeneral = async () => {
      const res = await fetch("/api/channels/fetchGeneral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverId: params?.serverId,
        }),
      });
      const { general } = await res.json();
      router.push(`/servers/${params?.serverId}/channels/${general._id}`);
    }

    fetchGeneral();
  
  }  , []);
  return (
    <div>
      <h1>Server ID</h1>
    </div>
  );
}

export default ServerIdPage;