import { Metadata } from "next";
import {
  DocTitle,
  DocH2,
  DocP,
  DocNote,
  DocTable,
  DocPager,
} from "@/components/layout/docs-shell";

export const metadata: Metadata = {
  title: "Security model",
  description:
    "How Crowkis approaches security: auth gates per surface, tenant isolation, the anti-poisoning pipeline, PII handling, and deployment guidance.",
};

export default function SecurityDocsPage() {
  return (
    <article>
      <DocTitle
        eyebrow="Reference"
        title="Security model"
        lead="A cache that reuses LLM answers is a trust system. This page describes what is enforced, where, and what you should know before exposing anything."
      />

      <DocH2 id="surfaces">Auth, per surface</DocH2>
      <DocTable
        head={["Surface", "Gate"]}
        rows={[
          ["RESP3 (Redis protocol)", <span key="1"><code className="inline">CROWKIS_AUTH_TOKEN</code> bearer auth, constant-time comparison.</span>],
          ["gRPC", "Same token gate as RESP."],
          ["Management REST", <span key="2"><code className="inline">CROWKIS_ADMIN_KEY</code>, RBAC API keys, or session auth. Reader endpoints need reader auth; mutating endpoints need stronger roles.</span>],
          ["Dashboard metrics & live feed", "Require the admin key or a management API key whenever auth is enabled."],
        ]}
      />
      <DocNote>
        Fail-closed default: when Crowkis is bound to a non-loopback address, management auth is
        required automatically. Forgetting to configure auth produces a locked deployment, not an
        open one.
      </DocNote>

      <DocH2 id="tenancy">Tenant isolation</DocH2>
      <DocP>
        Every semantic entry is namespaced by tenant. Lookups never cross the boundary — a
        paraphrase match in tenant A cannot serve an answer cached by tenant B. Isolation is also
        one of the five anti-poisoning stages, so cross-tenant anomalies score against a write
        being trusted at all.
      </DocP>

      <DocH2 id="poisoning">The anti-poisoning pipeline</DocH2>
      <DocP>
        Cache poisoning is the defining risk of semantic caching: one malicious or hallucinated
        write, served to every nearby query. Crowkis scores every write through five weighted
        stages before it is trusted:
      </DocP>
      <DocTable
        head={["Stage", "Signal", "Weight"]}
        rows={[
          ["1 — Coherence", "Does the answer semantically cohere with the question?", "0.30"],
          ["2 — Content", "Content-level heuristics on the answer itself.", "0.10"],
          ["3 — Source trust", "Track record of the writing source, from an append-only ledger.", "0.30"],
          ["4 — Isolation", "Tenant-boundary and namespace consistency.", "0.15"],
          ["5 — Neighbourhood", "Does it agree with its semantic neighbours?", "0.15"],
        ]}
      />
      <DocP>
        The composite must clear 0.75 or the write is refused. Every decision is recorded in the
        trust ledger, so &quot;why was this blocked?&quot; always has an answer.
      </DocP>

      <DocH2 id="pii">PII and compliance</DocH2>
      <DocP>
        A PII index supports scrubbing and erasure workflows over cached entries, with erasure
        reports exposed through the management API. Prompt previews are excluded from logs by
        default (<code className="inline">CROWKIS_LOG_QUERY_PREVIEWS=0</code>), and compliance
        report exports are built into the control plane.
      </DocP>

      <DocH2 id="guidance">Deployment guidance</DocH2>
      <DocP>Three decisions every deployment should make consciously:</DocP>
      <DocTable
        head={["Area", "Recommendation"]}
        rows={[
          ["TLS", "Terminate at your proxy or service mesh, like most data-plane infrastructure — keep Crowkis ports off the public internet."],
          ["Network placement", "Run on a trusted segment; bind beyond loopback only with CROWKIS_AUTH_TOKEN and CROWKIS_ADMIN_KEY set."],
          ["License enforcement", "Tier gating is honor-system (the CockroachDB / Sentry model), not DRM — verification is offline, nothing phones home."],
        ]}
      />

      <DocPager prev={["Configuration", "/docs/configuration"]} next={["Python SDK", "/docs/sdk-python"]} />
    </article>
  );
}
