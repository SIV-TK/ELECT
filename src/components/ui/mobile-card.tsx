'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  touchOptimized?: boolean;
}

export function MobileCard({ 
  title, 
  description, 
  children, 
  className,
  compact = false,
  touchOptimized = true
}: MobileCardProps) {
  return (
    <Card className={cn(
      'w-full transition-all duration-200',
      touchOptimized && 'active:scale-[0.98] hover:shadow-md',
      compact && 'p-0',
      className
    )}>
      {(title || description) && (
        <CardHeader className={cn(
          compact ? 'pb-2 px-4 pt-4' : 'pb-4'
        )}>
          {title && (
            <CardTitle className={cn(
              compact ? 'text-base' : 'text-lg sm:text-xl'
            )}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={cn(
        compact ? 'px-4 pb-4' : 'p-6 pt-0'
      )}>
        {children}
      </CardContent>
    </Card>
  );
}

export default MobileCard;
