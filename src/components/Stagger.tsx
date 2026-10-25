import { type ReactNode } from 'react';

// Lightweight staggered reveal using CSS animation delay utilities.
// Respects prefers-reduced-motion via the global CSS rule in index.css.
interface ItemProps {
  children: ReactNode;
  index: number;
  className?: string;
  delayStep?: number;
  baseDelay?: number;
}

export function StaggerItem({ children, index, className, delayStep = 80, baseDelay = 0 }: ItemProps) {
  const delay = baseDelay + index * delayStep;
  return (
    <div
      className={className}
      style={{ animation: `fade-up 0.5s ease-out ${delay}ms both` }}
    >
      {children}
    </div>
  );
}

// Page transition wrapper
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div style={{ animation: 'fade-in 0.35s ease-out both' }}>
      {children}
    </div>
  );
}
