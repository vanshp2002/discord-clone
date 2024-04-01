"use client";
import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface UserIdPageProps {
  params:{
    userId: string;
  }
}

const UserPage = ({
  params
}: UserIdPageProps) => {
  
  return (
    <div>Friend Page</div>
  )
}

export default UserPage;