"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  Vote,
  Lightbulb,
  BotMessageSquare,
  Landmark,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/politicians", icon: Users, label: "Politicians" },
  { href: "/demo-voting", icon: Vote, label: "Demo Voting" },
  { href: "/sentiment-analysis", icon: BotMessageSquare, label: "Sentiment Analysis" },
  { href: "/campaign-advice", icon: Lightbulb, label: "Campaign Advice" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Landmark className="text-primary h-8 w-8" />
            <h1 className="text-2xl font-headline font-bold">Sauti Ya Watu</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
           <SidebarTrigger className="md:hidden" />
           <div className="flex-1">
             <h1 className="text-xl font-semibold font-headline">
               {navItems.find(item => pathname === item.href)?.label || "Sauti Ya Watu"}
             </h1>
           </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
          Developed by Kariuki James Kariuki 0792698424
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
