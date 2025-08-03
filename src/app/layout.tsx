import type { Metadata } from 'next';
import './globals.css';
import dynamic from 'next/dynamic';

// Dynamically import components that might have SSR issues
const DynamicToaster = dynamic(() => import('@/components/ui/toaster').then(mod => ({ default: mod.Toaster })), { ssr: false });
const DynamicRootShell = dynamic(() => import('@/components/layout/root-shell').then(mod => ({ default: mod.RootShell })), { ssr: false });

export const metadata: Metadata = {
  title: 'Sauti Ya Watu',
  description: 'The Voice of the People - Kenya Election System',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
            <body className="font-body antialiased">
        <DynamicRootShell>
          {children}
        </DynamicRootShell>
        <DynamicToaster />
      </body>
    </html>
  );
}
