import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface MobileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary",
      outline: "border border-primary/20 bg-background hover:bg-primary/10 text-primary focus:ring-primary",
    };
    
    const sizes = {
      sm: "h-9 px-3 text-sm min-h-[44px] sm:h-9 sm:min-h-0",
      md: "h-10 px-4 py-2 min-h-[44px] sm:h-10 sm:min-h-0",
      lg: "h-11 px-8 min-h-[44px] sm:h-11 sm:min-h-0",
    };
    
    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MobileButton.displayName = "MobileButton";

interface MobileLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export const MobileLink = ({ href, children, className, external = false }: MobileLinkProps) => {
  const baseClasses = "inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
  
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClasses, className)}
      >
        {children}
      </a>
    );
  }
  
  return (
    <a href={href} className={cn(baseClasses, className)}>
      {children}
    </a>
  );
};