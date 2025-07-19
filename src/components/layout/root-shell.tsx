"use client";

import { usePathname } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';

export function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimalPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

  return !isMinimalPage ? <AppShell>{children}</AppShell> : children;
}
