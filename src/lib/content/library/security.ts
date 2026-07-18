import { PostSpec } from "./builder";

const TAG = "security";

export const securitySpecs: PostSpec[] = [
  {
    slug: "prompt-injection-and-caches",
    title: "Prompt injection meets your cache: the attack nobody threat-modeled",
    date: "2026-06-06",
    tag: TAG,
    summary:
      "Injected instructions in one response become served truth for every similar query, unless the cache can smell an answer that doesn't answer.",
    paras: [
      "Prompt injection analysis usually ends at the model: attacker smuggles instructions, model misbehaves once, incident closed. Add a naive cache and the blast radius changes category, the injected output gets stored, and the cache faithfully serves it to every future query in the semantic neighbourhood. One successful injection becomes standing infrastructure for the attacker.",
      "Crowkis's coherence stage exists for precisely this shape of attack: injected content characteristically fails to actually answer the question it's stored under, and coherence, weighted 0.30, the joint-heaviest stage, scores that mismatch before storage. Content heuristics add a second look, and neighbourhood agreement flags answers that contradict their semantic peers.",
      "Source trust closes the loop on persistence: a writer whose outputs keep getting refused accumulates ledger history and faces an ever-higher bar, so injection campaigns burn their own access. Every refusal is logged with its stage, your security team sees the attempt pattern, not just the absence of damage.",
      "The principle generalizes: any system that stores model output and re-serves it needs an immune response, because the model will eventually be made to say something hostile. Ours is five stages deep and keeps receipts.",
    ],
    plain:
      "If an attacker tricks the model once and you cache it, the trick replays forever. Crowkis checks whether an answer actually answers before storing it, and remembers who keeps sending garbage.",
    chart: "write-trust",
  },
  {
    slug: "supply-chain-deep-dive",
    title: "The supply-chain argument, made carefully",
    date: "2026-06-03",
    tag: TAG,
    summary:
      "After the 2026 gateway compromise, 'how many packages are in your hot path?' became a real procurement question. Our answer is a number: zero.",
    paras: [
      "March 2026's compromise of a major Python LLM gateway was a watershed less for its damage than for its lesson: the hot path of AI infrastructure had quietly accumulated thousand-package dependency trees, each package a door, each maintainer account a key under a mat. Security teams now ask vendors to enumerate their runtime dependencies. Most answers are spreadsheets.",
      "Ours is a sentence: the Crowkis runtime image contains one statically-compiled Rust binary, a non-root user, and an empty data directory. No interpreter, no package manager, no shell tooling to live off, no node_modules and no site-packages. The attack class that compromised the gateway, poisoning an upstream package, has no upstream to poison here.",
      "Signing closes the distribution edge: releases ship signed, so the binary you run is provably the binary we built. Verification is offline, like the licensing, no certificate dance with our servers, no trust in our uptime, nothing phoning anywhere ever.",
      "Supply-chain security is mostly subtraction, and subtraction has to happen at design time, you can't patch your way from a thousand dependencies to none. We started at none and stayed.",
    ],
    chart: "supply-chain",
  },
  {
    slug: "tenant-isolation-architecture",
    title: "Tenant isolation as physics, not policy",
    date: "2026-05-31",
    tag: TAG,
    summary:
      "A WHERE clause is a promise; a namespace is a wall. How Crowkis makes cross-tenant leakage structurally impossible rather than procedurally unlikely.",
    paras: [
      "Most multi-tenant data leaks share an autopsy: isolation was implemented as filtering, a tenant_id predicate that one code path, one day, forgot. Policy-based isolation fails open under bugs. The alternative is structural: make tenant identity part of the key itself, so a cross-tenant read isn't forbidden, it's unexpressible.",
      "Crowkis namespaces every entry by tenant at the storage layer; lookups operate within a namespace because there is no cross-namespace lookup to call. Then the write path adds the unusual second layer: isolation is a scored stage in the trust pipeline, so an entry whose characteristics suggest boundary confusion is refused before it exists. Leak prevention happens at write time, where it's cheap, not read time, where it's a breach.",
      "Deliberate sharing stays possible because it's explicit: platform-wide content lives in a designated shared tenant by choice, not by accident. The dashboard accounts per tenant, budgets gate per tenant, and Enterprise audit logs trace per tenant, the boundary is the organizing principle of the whole control plane.",
      "Caches see every question every customer asks, which makes them the most concentrated multi-tenant risk in an AI stack. Build the wall into the physics and the WHERE-clause genre of incident simply has nowhere to happen.",
    ],
    plain:
      "Customer A's answers and customer B's answers live in separate universes. The code can't accidentally cross them, because there's no path between universes to take by mistake.",
    chart: "write-trust",
  },
  {
    slug: "pii-lifecycle",
    title: "PII in a cache: scrub, isolate, erase, prove",
    date: "2026-05-28",
    tag: TAG,
    summary:
      "Users put personal data in prompts whether you like it or not. The cache's job is a full lifecycle: keep it out of shared entries, find it on demand, erase it provably.",
    paras: [
      "LLM inputs are a PII firehose by nature, users paste emails, order numbers, and medical details into anything with a text box. A cache that stores responses verbatim becomes an accidental PII database with the best query interface in your company. Pretending otherwise is how privacy reviews end careers.",
      "Crowkis treats the lifecycle explicitly. Scrubbing keeps identifiers out of shared cache entries, the template engine's slot abstraction does double duty here, lifting the personal specifics out of the stored skeleton. The PII index tracks where personal data lives, so 'what do you hold about X?' is a query, not an archaeology project.",
      "Erasure is workflow-grade: API-driven deletion with reports, built for the GDPR right-to-erasure clock rather than for a best-effort grep. Logs stay clean by default, CROWKIS_LOG_QUERY_PREVIEWS=0 ships as the default, so prompt text doesn't leak into your logging pipeline as a side effect of debugging convenience.",
      "Enterprise's Privacy Vault adds the strict tier: designated-sensitive entries under tighter handling, and compliance modes preset the whole posture per regime. Privacy in a cache is achievable; it just has to be load-bearing architecture instead of a paragraph in the DPA.",
    ],
    chart: "write-trust",
  },
  {
    slug: "fail-closed-philosophy",
    title: "Fail closed: why misconfiguring Crowkis locks it instead of opening it",
    date: "2026-05-25",
    tag: TAG,
    summary:
      "Most self-hosted breaches are defaults, not exploits. Crowkis inverts the failure direction: forget to configure auth and you get a locked deployment, not an open one.",
    paras: [
      "Scan the history of self-hosted data exposure and a pattern dominates: not zero-days but defaults, dashboards bound to 0.0.0.0 with auth 'coming in the hardening sprint.' The software trusted the operator to finish configuring it; the operator trusted the software to be safe meanwhile. Both were wrong together.",
      "Crowkis hard-codes the opposite assumption: the moment it detects a non-loopback bind, management and dashboard surfaces require authentication, no flag needed, no checklist item, enforced by the server itself. Forgetting to set CROWKIS_ADMIN_KEY on a public interface produces 401s, not an open control plane. The lazy path and the safe path are the same path.",
      "The escape hatch exists and is labeled like one: CROWKIS_ALLOW_UNAUTHENTICATED_ADMIN=1 is loud, explicit, and documented as local-experiments-only. Danger you must type deliberately is danger you can audit for; danger that arrives by omission is just a breach with a delay.",
      "Defaults are destiny in deployed software. We chose defaults on the theory that the operator is busy, the checklist is long, and the internet is patient. All three are always true.",
    ],
    plain:
      "If you expose Crowkis to a network and forget to set up auth, it locks itself instead of standing open. The mistake everyone eventually makes is the one we made harmless.",
    chart: "supply-chain",
  },
  {
    slug: "trust-ledger-explained",
    title: "The trust ledger: institutional memory for an immune system",
    date: "2026-05-22",
    tag: TAG,
    summary:
      "Every accept and refuse, per source, append-only. Trust with memory changes attacker economics, and gives auditors the artifact they actually want.",
    paras: [
      "Stateless security checks share a weakness: every attempt is a fresh coin flip, so attackers iterate freely until one lands. The trust ledger makes Crowkis's write pipeline stateful, every accept and refuse is appended per writing source, and source trust (weighted 0.30) reads that history on every new write. A source that shipped garbage yesterday faces a higher composite bar today.",
      "The economics this imposes on attackers are pleasingly hostile: probing the pipeline burns the prober's own standing, so iteration, the attacker's core tool, becomes self-defeating. Meanwhile honest-but-flaky sources (an agent with a hallucination habit, a webhook with a bug) get gracefully quarantined rather than catastrophically trusted.",
      "Append-only is the auditor-grade property: the ledger records what happened, in order, without edits, the provenance chain for any answer the cache ever served. Enterprise's persistent audit export turns 'why did the bot say that, and since when?' from an investigation into a query with a timestamp.",
      "Immune systems work because they remember. A cache that stores model output without remembering who to trust isn't defended, it's just organized.",
    ],
    chart: "write-trust",
  },
  {
    slug: "airgap-deployments",
    title: "Air-gapped by design: AI caching where the internet isn't invited",
    date: "2026-05-19",
    tag: TAG,
    summary:
      "No phone-home, offline license verification, one binary. The deployment story for networks that treat outbound packets as incidents.",
    paras: [
      "Air-gapped and egress-restricted environments run a brutal vendor filter: cloud control planes, online license checks, telemetry beacons, and package-manager installs all die at the firewall. Most modern AI tooling fails the filter in the first paragraph of its own docs, the architecture assumes a chatty relationship with the vendor.",
      "Crowkis assumes silence. The binary is self-contained; the license verifies with a local Ed25519 signature check against a baked-in public key, our servers are not consulted, ever; there is no telemetry to disable because none exists; and the dashboard, metrics, and full intelligence stack run entirely within the gap. Install media is one image file you carry in.",
      "The workload fit is stronger inside the gap, not weaker: constrained or accredited inference capacity makes every avoided model call precious, and the fixed-corpus analyst workloads typical of these environments are repetition engines. Sub-millisecond hits stretch scarce compute exactly where procurement cycles can't.",
      "Most vendors retrofit an 'offline mode' as a sales checkbox. Offline is our only mode, the connected deployment is just the air-gapped one with friendlier neighbors.",
    ],
    chart: "supply-chain",
  },
  {
    slug: "compliance-modes-explained",
    title: "Compliance modes: HIPAA, SOC2, GDPR-EU, FedRAMP as configuration",
    date: "2026-05-16",
    tag: TAG,
    summary:
      "Each regime wants specific retention, audit, and erasure behavior. Enterprise compliance modes preset the whole posture, so the auditor's checklist maps to a flag.",
    paras: [
      "Compliance work on infrastructure is usually translation labor: take a regime's controls, map each to scattered settings, document the mapping, defend it annually. The mapping rots as settings drift, and every audit re-litigates it. The fix is to make the regime itself the configuration unit.",
      "Crowkis Enterprise ships compliance modes as presets: select HIPAA, SOC2, GDPR-EU, or FedRAMP posture and the relevant behaviors, retention rules, PII handling strictness, audit-log persistence and export, erasure workflow guarantees, configure as a coherent set. The auditor's question 'how do you ensure X?' answers with a mode name and the mode's documented contract.",
      "The underlying machinery is the same trust-and-privacy stack every edition runs, the modes tighten and document it rather than bolting on a parallel system. That matters for honesty: compliance mode is the everyday engine with stricter dials, not a demo configuration that diverges from what actually serves traffic.",
      "Regulated teams don't fear controls; they fear ambiguity about controls. Presets kill the ambiguity, and the audit meeting gets shorter, which, in compliance, is the entire definition of victory.",
    ],
    chart: "write-trust",
  },
  {
    slug: "auth-surface-by-surface",
    title: "Four doors, four locks: the authentication architecture",
    date: "2026-05-13",
    tag: TAG,
    summary:
      "RESP, gRPC, REST, and the dashboard each get auth that fits their use, constant-time tokens for the data plane, RBAC for the control plane, mandatory locks past loopback.",
    paras: [
      "A system with four protocol surfaces needs four deliberate auth answers, not one stretched thin. Crowkis's data plane, RESP and gRPC, takes a bearer token compared in constant time, the right primitive for high-frequency machine traffic: fast, simple, immune to timing side-channels on the comparison.",
      "The control plane earns richer machinery, because humans and automation share it with different privileges: admin keys, hashed multi-user API keys, and sessions, with endpoints gated by role, readers read, writers mutate, admins administer. Dashboard metrics and the live feed sit behind the same gates, because operational telemetry is sensitive data wearing a graph.",
      "The binding rule ties it together: any non-loopback bind makes control-plane auth mandatory automatically, so the gap between 'deployed' and 'secured', where most real-world incidents live, doesn't exist. Local development stays frictionless on loopback; production stays locked by default.",
      "Enterprise grafts your identity provider on top via SSO/SAML/OIDC, making Okta offboarding equal Crowkis offboarding. Four doors, four locks, one rule: the easy path is the safe one.",
    ],
    chart: "supply-chain",
  },
  {
    slug: "why-closed-source-is-the-security-feature",
    title: "Closed-source as a security posture, argued honestly",
    date: "2026-05-10",
    tag: TAG,
    summary:
      "'Many eyes' assumes the eyes show up. For your hot path, a signed single binary with zero dependencies is a smaller attack surface than a thousand auditable packages nobody audits.",
    paras: [
      "The open-source security argument, many eyes make shallow bugs, quietly assumes the eyes exist, are expert, and are looking. The 2026 supply-chain compromises landed in fully open code with millions of users and effectively zero adversarial reviewers; openness didn't fail, but the assumption about eyes did. Meanwhile every open dependency tree is also open to attackers, who reliably do show up.",
      "Crowkis's posture trades theoretical auditability for actual surface reduction: one closed binary, zero runtime dependencies, signed releases. Your security team can't read our source, and also doesn't have to vet a thousand transitive packages, monitor their maintainer turnover, or race CVE disclosures through your hot path. The review burden collapses from a supply chain to a file signature.",
      "What you can verify is deliberately rich: the image's contents (one binary, enumerable in a minute), the signature, the zero-egress behavior (watch the network, nothing leaves), the auth boundaries (two curl commands), and the durability claims (kill the container yourself). We designed the verifiable surface to be the one that matters operationally.",
      "Neither posture is free. We chose the one whose failure mode is 'trust the vendor's signature' over the one whose failure mode is 'trust everyone in the dependency graph, forever.' For the component holding your customers' questions, we'd make that trade again.",
    ],
    chart: "supply-chain",
  },
];
