'use client';

import { usePageTracking } from '@/hooks/use-page-tracking';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  usePageTracking();
  
  return <>{children}</>;
}

export default AnalyticsProvider;
