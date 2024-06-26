import type { Metadata } from "next";
import { Open_Sans, Roboto, Source_Sans_3, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SharedStateProvider } from '@/components/providers/reply-provider';
import { ServerStateProvider } from '@/components/providers/server-provider';
import { SharedListProvider } from './../components/providers/list-provider';

// const font = Open_Sans({ weight: "600", subsets: ["latin"],  preload: true, });
const font = Open_Sans({weight:"variable", subsets: ["latin"],  preload: true, display: 'swap'});
// const font = Roboto({ weight:"400",  subsets: ["latin"] });
// const font = Source_Sans_3({ weight:"400",  subsets: ["latin"] });
// const font = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord.app",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
        <AuthProvider>
          <SharedListProvider>
            <ServerStateProvider>
              <SharedStateProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem={false}
                  storageKey="discord-theme">
                    <SocketProvider>
                      <ModalProvider />
                      <QueryProvider>
                        {children}
                      </QueryProvider>
                    </SocketProvider>
                </ThemeProvider>
              </SharedStateProvider>
            </ServerStateProvider>
          </SharedListProvider>
        </AuthProvider>
        </body>
    </html>
  );
}
