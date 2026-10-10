export type SiteEvent = "page_view" | "arcade_play" | "code_copy" | "demo_click" | "click" | "time";

/** Fire-and-forget site event for the admin dashboard. sendBeacon never blocks navigation. */
export function track(name: SiteEvent, meta?: string, path = location.pathname) {
  try {
    navigator.sendBeacon("/api/track", JSON.stringify({ name, path, meta }));
  } catch {}
}
