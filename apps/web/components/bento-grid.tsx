import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Bento Grid component for displaying items in a masonry-style layout.
 * One card can have a sliding animation effect.
 */
export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto grid max-w-7xl gap-4 p-4 md:grid-cols-3 md:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Brand Card component for Bento Grid.
 * Supports sliding animation and custom branding.
 */
export function BrandCard({
  brand,
  logo,
  className,
  slide = false,
  slideDelay = 0,
}: {
  brand: string;
  logo: ReactNode;
  className?: string;
  slide?: boolean;
  slideDelay?: number;
}) {
  return (
    <div
      className={cn(
        "group relative col-span-1 row-span-1 overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:shadow-lg",
        slide && "md:col-span-2",
        className
      )}
      style={slide ? { animationDelay: `${slideDelay}ms` } : undefined}
    >
      {/* Card content */}
      <div className="flex h-full w-full items-center justify-center p-6">
        {logo}
      </div>
      
      {/* Brand name overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-sm font-medium text-foreground">{brand}</p>
      </div>
      
      {/* Slide animation for specific card */}
      {slide && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-transparent" />
      )}
    </div>
  );
}

/**
 * Sliding Brand Card with animation.
 * Use this for the card that should slide in.
 */
export function SlidingBrandCard({
  brand,
  logo,
  className,
  delay = 0,
}: {
  brand: string;
  logo: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <BrandCard
      brand={brand}
      logo={logo}
      slide
      slideDelay={delay}
      className={cn(
        "animate-slide-in md:col-span-2",
        className
      )}
    />
  );
}

// Add CSS animation
const styles = `
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.6s ease-out forwards;
  }
`;

// Inject styles
export const injectBentoStyles = () => {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
};
