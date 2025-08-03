'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Home, 
  Vote, 
  Users, 
  AlertTriangle, 
  FileText, 
  BarChart3, 
  Settings,
  Shield,
  MapPin,
  Brain,
  Search,
  Bell
} from 'lucide-react';

const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/live-tally', label: 'Live Tally', icon: Vote },
  { href: '/live-tally', label: 'Live Tally', icon: BarChart3 },
  { href: '/verification-gallery', label: 'Gallery', icon: Users },
  { href: '/verification-gallery', label: 'Verify', icon: Shield },
  { href: '/fact-check', label: 'Fact Check', icon: FileText },
  { href: '/sentiment-analysis', label: 'Sentiment', icon: Brain },
  { href: '/constituency-map', label: 'Map', icon: MapPin },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
];

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-top">
      <div className="container flex h-14 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Vote className="h-4 w-4 text-white" />
          </div>
          <span className="hidden font-bold sm:inline-block">Sauti Ya Watu</span>
          <span className="font-bold sm:hidden">SYW</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex mx-6 flex-1 items-center space-x-4 lg:space-x-6">
          {navigationItems.slice(0, 6).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Actions */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">3</Badge>
          </Button>

          {/* Search */}
          <Button variant="ghost" size="sm" className="h-8 w-8 px-0 hidden sm:flex">
            <Search className="h-4 w-4" />
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden h-8 w-8 px-0">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 safe-top">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded flex items-center justify-center">
                    <Vote className="h-3 w-3 text-white" />
                  </div>
                  <span>Sauti Ya Watu</span>
                </SheetTitle>
              </SheetHeader>
              
              <nav className="mt-6 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                
                <div className="border-t pt-4 mt-4">
                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default MobileHeader;
