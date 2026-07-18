import { ReactNode } from "react";

/**
 * Content is never hidden behind scroll-triggered animation on this site, * everything renders immediately. These wrappers keep the old call sites
 * working while doing nothing but layout.
 */

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function HoverCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
