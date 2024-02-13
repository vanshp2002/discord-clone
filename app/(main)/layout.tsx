"use client";

import { NavigationSidebar } from '@/components/navigation/navigation-sidebar';
import { useSession } from 'next-auth/react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {

    const { data: session } = useSession();
    return (
        <div className="h-full">
           <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
            <NavigationSidebar email={session?.user?.email}/>
      </div>
      <main className="h-full md:pl-[72px]">
        {children}
      </main>
        </div>
    )
}

export default MainLayout;