"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";

import { useRouter, useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";

interface userHomeProps {
    id: string;
}

export const UserHome = ({ id }: userHomeProps) => {
    const router = useRouter();
    const params = useParams();
    const { theme } = useTheme();
    const [isClicked, setIsClicked] = useState(false);

    const onClick = () => {
        setIsClicked(true);
        router.push(`/friends/${id}`);
        setTimeout(() => setIsClicked(false), 100);
    }


    return (
        <div>
            
            <ActionTooltip
                side="right"
                align="center"
                label="Direct Messages"
            >
                <button onClick={onClick} className={cn(  
                    "group relative flex items-center transition-all",
                    isClicked && "transform translate-y-1"
                )}
                style={{
                    borderRadius: "24px",
                    padding: "0",
                }}>
                    <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.userId !== id && "group-hover:h-[20px]",
                    params?.userId === id ? "h-[36px]" : "h-[8px]"
                )}/> 
                    <div className={cn(
                        "flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-indigo-500",
                        params?.userId === id && "bg-background bg-neutral-100 dark:bg-indigo-500 rounded-[16px]"
                    )}>
                        <img src={theme === "light" ? "https://utfs.io/f/63ecd362-b74f-42fb-9889-e70339dd170a-ya2lay.png" : "https://utfs.io/f/c1f048ea-5650-4d28-833e-435165c10fdf-vfvqf8.png"} alt="Discord" className="h-8 w-8" />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}

