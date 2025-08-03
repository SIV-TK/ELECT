'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Vote, 
  BarChart3, 
  Users, 
  Settings 
} from 'lucide-react';

const bottomNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/live-tally', label: 'Tally', icon: Vote },
  { href: '/live-tally', label: 'Tally', icon: BarChart3 },
  { href: '/verification-gallery', label: 'Gallery', icon: Users },
  { href: '/dashboard', label: 'More', icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t safe-bottom md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full relative transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5 mb-1" />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 -left-2 -right-2 -bottom-1 bg-primary/10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
