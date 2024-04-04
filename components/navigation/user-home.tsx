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
        router.push(`/user/${id}/friends`);
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
                        borderRadius: "26px",
                        padding: "0",
                    }}>
                    <div className={cn(
                        "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                        params?.userId !== id && "group-hover:h-[20px]",
                        params?.userId === id ? "h-[36px]" : "h-[8px]"
                    )} />
                    <div className={cn(
                        "flex mx-3 h-[52px] w-[52px] rounded-[26px] group-hover:rounded-[18px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-indigo-500",
                        params?.userId === id && "bg-background bg-neutral-100 dark:bg-[#686bff] rounded-[18px]"
                    )}>
                        <img src={theme === "light" ? "https://utfs.io/f/63ecd362-b74f-42fb-9889-e70339dd170a-ya2lay.png" : "https://utfs.io/f/fc897382-0524-4e2a-8e3b-3ab10590392d-5hrk1p.png"} alt="Discord" className="h-9 w-9 " />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}

