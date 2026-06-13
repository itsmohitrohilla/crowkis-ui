import { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { DocsShell } from "@/components/layout/docs-shell";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <DocsShell>{children}</DocsShell>
    </SiteShell>
  );
}
