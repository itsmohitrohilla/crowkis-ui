export type SiteEvent = "page_view" | "arcade_play" | "code_copy" | "demo_click";

/** Fire-and-forget site event for the admin dashboard. sendBeacon never blocks navigation. */
export function track(name: SiteEvent, meta?: string) {
  try {
    navigator.sendBeacon("/api/track", JSON.stringify({ name, path: location.pathname, meta }));
  } catch {}
}
