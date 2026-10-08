"use client";

import { ReactNode } from "react";
import { DEMO_URL } from "@/lib/content";
import { track } from "@/lib/track";

/** Opens the demo booking page in a new tab and records the click for the admin dashboard. */
export function DemoLink({
  where,
  className,
  onClick,
  children,
}: {
  where: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <a
      href={DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track("demo_click", where);
        onClick?.();
      }}
      className={className}
    >
      {children}
    </a>
  );
}
