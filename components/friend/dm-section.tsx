
import React from 'react';
import { ActionToolTip } from '@/components/ui/action-tooltip';
import { Plus } from 'lucide-react';
import { useListState } from '@/components/providers/list-provider';
import { useRouter, useParams } from 'next/navigation';

interface DmSectionProps {
    label: string;    
}


export const DmSection = ({
    label,
}: DmSectionProps) => {

    const { list, setList } = useListState();
    const router = useRouter();
    const params = useParams();

    const onClick = () => {
        setList("all");
        router.push(`/user/${params?.userId}/friends/`)
    }

    return (

        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {(
                <ActionToolTip label="Create DM" side="top">
                    <button
                        onClick={onClick}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                        <Plus className="h-4 w-4" />
                    </button>
                </ActionToolTip>
            )}
        </div>
    )
}