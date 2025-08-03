"use client";

import { usePathname } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { MobileHeader } from '@/components/layout/mobile-header';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';

export function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimalPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

  if (isMinimalPage) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <main className="pb-16 md:pb-0">
        <AppShell>{children}</AppShell>
      </main>
      <MobileBottomNav />
    </div>
  );
}
