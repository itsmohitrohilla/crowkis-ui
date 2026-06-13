"use client";

import { useState } from "react";
import { CrowShooter } from "@/components/crow/crow-shooter";

export function CrowGameLauncher({
  className = "",
  label = "Play full-screen ▸",
}: {
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className || "btn-primary"}>
        {label}
      </button>
      {open ? <CrowShooter onClose={() => setOpen(false)} /> : null}
    </>
  );
}
