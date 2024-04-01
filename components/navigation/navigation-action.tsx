"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { useState } from "react";


export const NavigationAction = () => {
    const { onOpen } = useModal();
    const [isClicked, setIsClicked] = useState(false);
    const onClick = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 100);
        onOpen("createServer", {});
    }   
    return (
        <div >
            <ActionTooltip
                side="right"
                align="center"
                label="Add a server"
            >
                <button onClick={onClick} className={cn(  
                    "group relative flex items-center transition-all",
                    isClicked && "transform translate-y-1"
                )}
                style={{
                    borderRadius: "24px",
                    padding: "0",
                }}>
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                        <Plus className="group-hover:text-white transition text-emerald-500" size={25}>

                        </Plus>
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}