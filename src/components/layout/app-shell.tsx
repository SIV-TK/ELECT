// src/components/layout/app-shell.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  Vote,
  Lightbulb,
  BotMessageSquare,
  Landmark,
  UsersRound,
  GalleryVertical,
  LayoutDashboard,
  Shield,
  ListChecks,
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

const navItems = [
// Removed Home from dashboard sidebar navigation
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/politicians", icon: Users, label: "Politicians" },
  { href: "/demo-voting", icon: Vote, label: "Demo Voting" },
  { href: "/sentiment-analysis", icon: BotMessageSquare, label: "Sentiment Analysis" },
  { href: "/campaign-advice", icon: Lightbulb, label: "Campaign Advice" },
  { href: "/crowd-sourced-intel", icon: UsersRound, label: "Crowd Sourced Intel" },
  { href: "/verification-gallery", icon: GalleryVertical, label: "Verification Gallery" },
  { href: "/live-tally", icon: Landmark, label: "Live Tally" },
];

const adminNavItems = [
    { href: "/admin/add-politician", icon: Shield, label: "Add Politician" },
    { href: "/admin/submit-tally", icon: ListChecks, label: "Submit Tally" },
];

const authNavItems = [
    { href: "/login", icon: LogIn, label: "Login" },
    { href: "/signup", icon: UserPlus, label: "Sign Up" },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  // Don't render shell for home and login pages
  if (pathname === '/' || pathname === '/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getPageTitle = () => {
    const allItems = [...navItems, ...adminNavItems, ...authNavItems];
    const exactMatch = allItems.find(item => item.href === pathname);
    if (exactMatch) return exactMatch.label;
    
    if (pathname.startsWith('/politicians/')) return "Politician Profile";
    if (pathname.startsWith('/admin/')) return "Admin Tools";
    
    const rootMatch = allItems.find(item => item.href !== '/' && pathname.startsWith(item.href));
    if (rootMatch) return rootMatch.label;
    
    return "Sauti Ya Watu";
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup';

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
                    isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarMenu>
                {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                    <SidebarMenuButton
                        isActive={pathname.startsWith(item.href)}
                        tooltip={item.label}
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>
           <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarMenu>
                {!isAuthenticated ? authNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                    <SidebarMenuButton
                        isActive={pathname.startsWith(item.href)}
                        tooltip={item.label}
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                )) : (
                  <SidebarMenuItem>
                     <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                       <LogOut />
                       <span>Logout</span>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
           <SidebarTrigger className="md:hidden" />
           <div className="flex-1">
             <h1 className="text-xl font-semibold font-headline">
               {getPageTitle()}
             </h1>
           </div>
           <div className="flex items-center gap-2">
            {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={`https://placehold.co/100x100.png`} alt={user?.fullName} data-ai-hint="user avatar" />
                         <AvatarFallback>{user?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                       </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                     <DropdownMenuLabel className="font-normal">
                       <div className="flex flex-col space-y-1">
                         <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                         <p className="text-xs leading-none text-muted-foreground">
                           {user?.email}
                         </p>
                       </div>
                     </DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : !isAuthPage ? (
                <div className="hidden md:flex items-center gap-2">
                    <Link href="/login" passHref>
                        <Button variant="outline">Login</Button>
                    </Link>
                    <Link href="/signup" passHref>
                        <Button>Sign Up</Button>
                    </Link>
                </div>
           ) : null}
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
