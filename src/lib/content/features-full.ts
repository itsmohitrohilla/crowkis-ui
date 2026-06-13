export type FeatureStatus = "shipped" | "hardening" | "designed";
export type FeatureTier = "free" | "pro" | "enterprise";

export type FeatureItem = {
  name: string;
  what: string;
  why: string;
  status: FeatureStatus;
  tier?: FeatureTier;
};

export type FeatureGroup = { group: string; items: FeatureItem[] };

export const featureGroups: FeatureGroup[] = [
  {
    group: "Identity & access",
    items: [
      {
        name: "Role-based access control",
        what: "Admin, Reader, and Auditor roles, enforced on every management route.",
        why: "The person who can flush the cache and the person who can only read reports are different people — and the server knows it.",
        status: "shipped",
      },
      {
        name: "API keys, argon2id-hashed",
        what: "crwk_-prefixed keys with per-user create / rotate / revoke, stored only as argon2id hashes — never plaintext.",
        why: "A leaked database never leaks a usable key.",
        status: "shipped",
      },
      {
        name: "Per-tenant users + sessions",
        what: "User management and session auth per tenant, with constant-time token comparison.",
        why: "No timing side-channel on the front door, and every tenant runs its own people.",
        status: "shipped",
      },
      {
        name: "Dashboard auth + CSRF",
        what: "Admin-key / bearer gate with double-submit CSRF protection and a localhost dev-open fallback.",
        why: "The dashboard is sensitive data wearing a graph; it's gated like one.",
        status: "shipped",
      },
      {
        name: "SAML / SSO",
        what: "SAML config, metadata, and ACS endpoints are in place; assertion-hardening is underway before regulated production.",
        why: "Your identity provider will own login — the plumbing is already there.",
        status: "hardening",
        tier: "enterprise",
      },
    ],
  },
  {
    group: "Multi-tenancy & isolation",
    items: [
      {
        name: "Hard tenant isolation",
        what: "Every cache key is tenant-tagged and the read path enforces the tag — no cross-tenant read exists under any code path (invariant-tested).",
        why: "Customer A's answer can never surface in customer B's session. It's physics, not a WHERE clause.",
        status: "shipped",
      },
      {
        name: "Per-tenant ops",
        what: "Stats, budgets, flush, and erasure are all tenant-scoped in the management API.",
        why: "Operate each tenant independently without ever touching the others.",
        status: "shipped",
      },
      {
        name: "Per-tenant rate limits (CKEYLIMIT)",
        what: "RPM / TPM limits enforced per tenant on the CGET/CSET fast path.",
        why: "One noisy tenant can't starve the rest.",
        status: "shipped",
        tier: "pro",
      },
    ],
  },
  {
    group: "Compliance & governance",
    items: [
      {
        name: "Tamper-evident audit chain",
        what: "Each audit event is sha256(prev ‖ event); verify_audit_chain() detects any tamper, reorder, or deletion.",
        why: "Your audit log can prove it wasn't edited — the artifact auditors actually want.",
        status: "shipped",
      },
      {
        name: "crowkis attest",
        what: "An attestation report with the chain verdict, exiting code 2 on a broken chain so CI / cron can alert.",
        why: "Continuous proof of integrity, not a once-a-year scramble.",
        status: "shipped",
        tier: "enterprise",
      },
      {
        name: "Compliance mode packs",
        what: "CROWKIS_COMPLIANCE_MODE = hipaa / soc2 / gdpr-eu / fedramp, with an honest control table (always-on / active / operator-managed / planned).",
        why: "The regime maps to a config flag — and the table never lies about what's automated.",
        status: "shipped",
      },
      {
        name: "Audit export",
        what: "crowkis export-audit writes JSONL evidence for your records.",
        why: "Hand the auditor a file, not a database login.",
        status: "shipped",
        tier: "enterprise",
      },
      {
        name: "PII scrub + right-to-erasure",
        what: "Always-on PII detection on write, plus CPII REPORT|ERASE and subject-scoped REST erasure.",
        why: "A GDPR erasure request is a command, not a fire drill.",
        status: "shipped",
      },
      {
        name: "Compliance reports",
        what: "SOC2 / HIPAA / GDPR report endpoints plus /compliance/export.",
        why: "The paperwork generates itself.",
        status: "shipped",
      },
    ],
  },
  {
    group: "Security & data protection",
    items: [
      {
        name: "5-stage anti-poisoning pipeline",
        what: "Coherence, content policy, source trust, tenant isolation, and neighbourhood-anomaly stages score every write; incoherent or poisoned writes are rejected.",
        why: "One bad answer in a semantic cache spreads to every nearby query. This stops it at the door.",
        status: "shipped",
      },
      {
        name: "Source trust scoring + ledger",
        what: "A composite trust gate, recorded in a trust ledger and re-evaluated at read time.",
        why: "Trust has memory — a source that wrote garbage earns a higher bar.",
        status: "shipped",
      },
      {
        name: "Zero telemetry",
        what: "Nothing phones home; the cache never exfiltrates data.",
        why: "Your customers' questions stay on your machine. Air-gap friendly.",
        status: "shipped",
      },
      {
        name: "BYOK encryption",
        what: "Bring-your-own-key encryption for cached data.",
        why: "Key custody stays entirely with you.",
        status: "designed",
        tier: "enterprise",
      },
      {
        name: "Prompt-injection firewall",
        what: "Read-side screening that catches injection patterns before they're served.",
        why: "A hostile prompt shouldn't become a trusted cached answer.",
        status: "designed",
        tier: "enterprise",
      },
      {
        name: "DLP egress controls",
        what: "Data-loss-prevention checks on what leaves the cache.",
        why: "Stop sensitive content leaving by policy, not by hope.",
        status: "designed",
        tier: "enterprise",
      },
    ],
  },
  {
    group: "Cost, FinOps & billing",
    items: [
      {
        name: "Per-tenant chargeback / showback",
        what: "Cost-attribution report, dashboard panel, and CSV export per tenant — returns an honest 402 on lower tiers.",
        why: "Bill your own teams or customers for exactly what they used.",
        status: "shipped",
        tier: "enterprise",
      },
      {
        name: "Budgets + circuit breaker",
        what: "Daily / monthly token and USD budgets with alerts and a cache-only circuit breaker.",
        why: "A runaway loop hits a wall, not your invoice.",
        status: "shipped",
      },
      {
        name: "$-saved headline",
        what: "dollars_saved_today and dollars_saved_total with a configurable $/1k rate.",
        why: "The ROI argument writes itself on the dashboard.",
        status: "shipped",
      },
      {
        name: "crowkis replay",
        what: "Replay your own billing.csv through the cache to prove savings on real spend.",
        why: "We pitch with your data, not our slides.",
        status: "shipped",
        tier: "pro",
      },
      {
        name: "crowkis suggest",
        what: "Warm / tune / diversify recommendations drawn from your traffic.",
        why: "The cache tells you how to make it earn more.",
        status: "shipped",
        tier: "pro",
      },
    ],
  },
  {
    group: "Reliability & operations",
    items: [
      {
        name: "Crash-safe storage",
        what: "WAL with CRC32 and partial recovery, LSM compaction, and atomic snapshots.",
        why: "Pull the plug mid-write; your cache comes back intact.",
        status: "shipped",
      },
      {
        name: "Snapshot backup / restore",
        what: "CSAVE / CBGSAVE plus crowkis backup / restore writing .crowkbak archives.",
        why: "Your cache state is yours to move, copy, and keep.",
        status: "shipped",
      },
      {
        name: "Weighted multi-provider load balancing",
        what: "Smooth weighted round-robin across LLM providers.",
        why: "Spread load and cost across backends on your terms.",
        status: "shipped",
        tier: "enterprise",
      },
      {
        name: "Model migration & canary rollout",
        what: "Leased work batches, dry runs, retries, and operator recovery via the dashboard Migration Control.",
        why: "Upgrade models without cold-starting your warm cache.",
        status: "shipped",
        tier: "enterprise",
      },
      {
        name: "Read-replica HA · PITR · cross-region",
        what: "High-availability replicas, point-in-time recovery, and cross-region deployment.",
        why: "For the deployments where downtime is a headline.",
        status: "designed",
        tier: "enterprise",
      },
    ],
  },
  {
    group: "Observability & integration",
    items: [
      {
        name: "Prometheus metrics",
        what: "A /metrics scrape endpoint in native exposition format.",
        why: "Lights up in your existing Grafana with zero adapters.",
        status: "shipped",
      },
      {
        name: "Live operations dashboard",
        what: "Savings, trends, security, DB internals, tenants, budgets, and a live log — customizable per browser, edition-aware.",
        why: "The first question about any cache — 'what's it doing?' — has a visual answer.",
        status: "shipped",
      },
      {
        name: "Structured JSON logs",
        what: "JSONL logs, colour-coded by crowkis tail.",
        why: "Your log pipeline ingests them without grooming.",
        status: "shipped",
      },
      {
        name: "SIEM · OTel · Slack / PagerDuty",
        what: "SIEM streaming, OpenTelemetry traces, and Slack / PagerDuty alerting.",
        why: "Fits the bigger observability and on-call stack.",
        status: "designed",
        tier: "enterprise",
      },
    ],
  },
  {
    group: "Cache intelligence — the moat",
    items: [
      {
        name: "Semantic + structural cache",
        what: "Meaning and structure must both agree before a hit counts.",
        why: "Catches paraphrases without ever serving the wrong answer.",
        status: "shipped",
      },
      {
        name: "Adaptive thresholds",
        what: "Per-intent reuse thresholds tune themselves from live hit/miss feedback.",
        why: "The cache gets smarter about your traffic on its own.",
        status: "shipped",
      },
      {
        name: "Confidence scoring",
        what: "A multi-signal score gates every response.",
        why: "Uncertain matches go to the model instead of guessing.",
        status: "shipped",
      },
      {
        name: "Smart eviction + CWHYEVICT",
        what: "Cost-aware eviction with CWHYEVICT explainability for any decision.",
        why: "Expensive answers aren't discarded like cheap ones — and you can ask why.",
        status: "shipped",
      },
      {
        name: "Reasoning reuse (CTHINK / CREUSE)",
        what: "Extract, abstract, and recompose chain-of-thought structure for new inputs.",
        why: "Reuse the expensive thinking, not just the final words.",
        status: "shipped",
      },
      {
        name: "Freshness control + webhooks",
        what: "TTL policies plus webhook-driven invalidation.",
        why: "Yesterday's price never outlives its shelf life.",
        status: "shipped",
      },
      {
        name: "Stale-while-revalidate",
        what: "CGET … ALLOW_STALE serves a slightly stale answer instantly while refreshing behind it.",
        why: "Zero-latency reads that still self-heal.",
        status: "shipped",
      },
    ],
  },
  {
    group: "Distribution & adoption",
    items: [
      {
        name: "Drop-in Redis",
        what: "RESP2 / RESP3 with ~40 Redis commands plus 19 Crowkis commands.",
        why: "Point your existing Redis client at one new port — no rewrite.",
        status: "shipped",
      },
      {
        name: "MCP server",
        what: "crowkis mcp lets any AI agent use the cache as a tool; stats and dashboard are exposed as MCP resources.",
        why: "Claude Code and agents check the cache before spending tokens — and it's free.",
        status: "shipped",
        tier: "free",
      },
      {
        name: "Python + Node SDKs",
        what: "Retry / backoff, typed helpers, and a CachedOpenAI drop-in wrapper.",
        why: "Caching disappears into one function call.",
        status: "shipped",
      },
      {
        name: "Two images, three tiers",
        what: "A free image (paid code compiled out, verified) and a paid image whose license selects Community / Pro / Enterprise, plus a Helm chart and hardened compose.",
        why: "Adopt free, upgrade by license — no migration.",
        status: "shipped",
      },
    ],
  },
];
