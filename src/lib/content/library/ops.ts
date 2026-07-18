import { PostSpec } from "./builder";

const TAG = "operations";

export const opsSpecs: PostSpec[] = [
  {
    slug: "five-minute-deploy",
    title: "The five-minute deploy, timed honestly",
    date: "2026-06-08",
    tag: TAG,
    summary:
      "Pull, run, first hit in the dashboard, with no config file, no signup, and no environment variables you're required to set. We timed it. It holds.",
    paras: [
      "Five-minute-install claims are the most inflated stat in infrastructure marketing, so here's ours itemized: docker pull (under a minute on sane bandwidth), one docker run with a volume mount (seconds), dashboard open (instant), first CSET/CGET through crowkis cli (a minute of typing), first semantic hit visible in the live feed. Total: under five, no asterisks.",
      "The number holds because of what's absent: no config file to author, no required environment variables (defaults are production-sane), no account to create, no license to acquire, Community boots at full power with nothing. Configuration exists as enrichment for the second hour, not as a toll on the first five minutes.",
      "The fail-open posture extends the courtesy to mistakes: bad license file? Boots as Community. Missing embedder model? Falls back to the stub. Unauthenticated probe? 401, not a crash. The binary's standing instruction is to come up and be useful, loudly noting anything degraded.",
      "Infrastructure adoption dies in the gap between curiosity and first success. We engineered that gap down to a coffee's length, because the dashboard's first saved-dollar tick is a better salesperson than this paragraph.",
    ],
    plain:
      "One pull, one run, no setup, and you'll watch your first cache hit land before your coffee cools. The hard parts are all optional and all later.",
    chart: "drop-in",
  },
  {
    slug: "binary-swap-upgrades",
    title: "Upgrades as non-events: the binary-swap contract",
    date: "2026-06-05",
    tag: TAG,
    summary:
      "docker pull, restart, done, no schema migrations, no export/import, no upgrade runbook. The on-disk format is a stability promise, not an implementation detail.",
    paras: [
      "Upgrade dread is learned behavior: operators have been burned by migrations that lock tables, version dances with required waypoints, and release notes whose 'breaking changes' section needs its own table of contents. The dread taxes everyone, teams running old versions out of fear are running old bugs out of fear.",
      "Crowkis's upgrade contract is one move: pull the new image, restart the container. The on-disk format, WAL, SSTables, vector index, the lot, is stable across releases as a promise, not a coincidence; the new binary reads what the old one wrote and gets to work. No migration step exists to fail.",
      "The contract is enforced where promises become real: the release gate includes booting new builds against existing data and verifying the corpus serves identically. A release that would require a migration doesn't pass the gate, which means the question of whether this upgrade is 'one of the risky ones' has a standing answer: no.",
      "Cheap upgrades change behavior: you track current, you get fixes the week they ship, and 'what version are we on?' stops being a forensic question. The best release process is the one nobody schedules a meeting for.",
    ],
    chart: "drop-in",
  },
  {
    slug: "observability-stack",
    title: "Three windows into one cache: dashboard, Prometheus, logs",
    date: "2026-06-02",
    tag: TAG,
    summary:
      "The built-in dashboard for humans, /metrics for your Grafana, one JSON line per event for your pipeline, same truth, three consumers, zero adapters.",
    paras: [
      "Observability fails in two directions: tools that demand their own stack (another agent, another bill) and tools that emit nothing useful. Crowkis threads it with three native windows aimed at three consumers, all reading the same engine state, none requiring an adapter.",
      "Humans get the dashboard: the live verdict feed with per-decision confidence and deciding stage, hit-type breakdowns, per-tenant economics, top queries and top misses, memory and storage pressure. It answers the operator's first question, what is this thing actually doing?, visually and in real time.",
      "Machines get /metrics in Prometheus exposition format and OpenTelemetry signals, so the cache lights up inside whatever Grafana or Datadog estate you already run; alerts ride your existing alerting. Pipelines get structured logs, one JSON line per significant event, no spam, rotation configured, so your log stack ingests without grooming.",
      "The discipline underneath: a significant event logs once, an insignificant one logs never, and nothing requires a log-level safari to make usable. Observability is respect for the operator's attention, encoded.",
    ],
    plain:
      "Watch it in the built-in dashboard, graph it in your existing Grafana, or read clean JSON logs, whichever your team already does, Crowkis plugs in without new tooling.",
    chart: "drop-in",
  },
  {
    slug: "kubernetes-deployment",
    title: "Crowkis on Kubernetes: a well-behaved citizen",
    date: "2026-05-30",
    tag: TAG,
    summary:
      "One container, a PVC, real health probes, hard memory bounds, graceful shutdown. Everything your cluster expects from a tenant that's read the manual.",
    paras: [
      "Kubernetes rewards workloads with simple shapes, and Crowkis's shape is the simplest: one container, one persistent volume at /data, configuration entirely via environment. A Deployment (or StatefulSet, if you prefer the identity semantics) with a PVC is the whole manifest story, no operators, no CRDs, no sidecar entourage.",
      "The probes are real: /health is wired into the image and reports actual readiness, including whether admin auth is active, so the kubelet's view matches reality. SIGTERM triggers graceful shutdown with WAL integrity preserved, pod rescheduling is a non-event, with the corpus intact on the PVC when the replacement mounts it.",
      "Resource governance is honest because the runtime has no garbage collector lying about memory: CROWKIS_MEMORY_LIMIT and the block-cache bound mean requests and limits you set are bounds the process actually respects. No OOMKill roulette, no mystery RSS growth at 3 a.m.",
      "Run one instance per cluster license, scale it vertically (free), and let your existing Prometheus operator scrape /metrics. The Helm chart packages this shape for one-line installs, but the shape was always simple enough that the chart is a convenience, not a requirement.",
    ],
    chart: "drop-in",
  },
  {
    slug: "canary-workflow",
    title: "Running a model canary: the operator's walkthrough",
    date: "2026-05-26",
    tag: TAG,
    summary:
      "Slice the traffic, compare against cached baselines, promote or retreat, model upgrades as a controlled experiment with the cache as your measuring instrument.",
    paras: [
      "Model upgrades without process are vibes-based engineering: switch the string, watch support tickets, hope. The canary workflow makes them an experiment. Register the new model as a backend, route a configured slice of traffic to it, and let the cache do something unique, compare the canary's answers against your corpus of cached, served, confidence-scored baselines from the incumbent.",
      "That comparison is the underrated asset: your cache is a ground-truth library of what good answers looked like, per intent class. Quality regressions surface as divergence patterns in the dashboard before they surface as user complaints, visible per intent, so you can see that the new model improved reasoning but regressed terse factual answers, and decide with specifics.",
      "Promotion is then mechanical rather than dramatic: migrate cache entries with leasing (old answers serve until replacements verify, no hit-rate cliff), shift routing fully, retire the incumbent. Retreat is equally cheap: collapse the slice to zero, nothing lost, corpus untouched.",
      "Frequent-upgrade teams converge on this rhythm because it removes the courage requirement from model adoption. The best model ships quarterly now; your process should metabolize that without a war room.",
    ],
    chart: "migration",
  },
  {
    slug: "federation-fallback",
    title: "Fallback routing: surviving your provider's bad day",
    date: "2026-05-23",
    tag: TAG,
    summary:
      "Providers have incidents; your product doesn't have to. Health-aware backend routing plus a warm cache turns upstream outages into degraded modes users barely notice.",
    paras: [
      "Every LLM provider has status-page afternoons, and a single-provider architecture inherits all of them as its own outages. The federation layer in Crowkis registers multiple backends, hosted rivals, your local vLLM, whatever, with health tracking, and routes around the unhealthy automatically. Provider incident becomes routing event.",
      "The cache changes the math of degradation in a way pure gateways can't: during an outage, your entire warm corpus keeps serving at full speed regardless of upstream health. The repeated head of traffic, the majority, in mature deployments, doesn't even notice the incident. Only novel queries feel the fallback, and they get the backup backend instead of an error.",
      "Cross-provider consistency comes from the same machinery as everywhere else: fallback answers face the same write gates, and Enterprise's cache bridge means answers banked from the primary serve equivalent queries during the fallback window, no split-brain corpus, no quality whiplash.",
      "Resilience reviews usually price redundancy in standby compute. A warm semantic cache is the cheapest redundancy you'll ever buy: it's the only failover asset that was already paying for itself before the incident.",
    ],
    chart: "migration",
  },
  {
    slug: "memory-governance",
    title: "Memory governance: a cache that respects its container",
    date: "2026-05-20",
    tag: TAG,
    summary:
      "CROWKIS_MEMORY_LIMIT means what it says, no GC mood swings, no mystery RSS, eviction that engages before the kernel has opinions.",
    paras: [
      "The classic cache-in-a-container failure: memory drifts up, the limit is a suggestion the runtime's garbage collector negotiates with, and one day the OOM killer adjudicates. Post-mortems blame the limit, the workload, or the moon. The real culprit is a runtime that can't make memory promises.",
      "Rust can make them, and Crowkis does: CROWKIS_MEMORY_LIMIT bounds the process, CROWKIS_BLOCK_CACHE_BYTES bounds the read accelerator inside it, and the memtable's 64MB flush threshold bounds write buffering. No collector defers reclamation to a more convenient mood; allocation discipline is structural.",
      "Pressure response is graduated rather than catastrophic: as usage approaches bounds, smart eviction engages, shedding entries by the recency/frequency/isolation/cost score, cheapest-to-rebuild first, so the cache slims itself economically long before the kernel gets involved. The dashboard shows the pressure curve, so capacity planning is a graph, not a guess.",
      "The operational payoff is trust in your own configs: requests and limits you write are bounds that hold, sizing math survives contact with production, and the OOM-killer chapter of your runbook quietly goes unused.",
    ],
    chart: "budget-wall",
  },
  {
    slug: "dashboard-tour",
    title: "A tour of the dashboard: six panels, zero mysteries",
    date: "2026-05-17",
    tag: TAG,
    summary:
      "Live verdicts, hit-type economics, top misses, safety blocks, tenant accounting, system pressure, what each panel answers and who keeps it open.",
    paras: [
      "The live verdict feed is the dashboard's heartbeat and the fastest trust-builder in the product: every hit, miss, and refusal streams past with its confidence score and the gate that decided, DUAL HIT at 0.94, BLOCKED at stage 3. New operators watch it the way you watch a fish tank; auditors watch it the way they watch evidence.",
      "The economics panels translate engineering into budget language: hit-type breakdown (vector, structural, dual, dedup, reasoning) shows which intelligence earns; saved-spend counts dollars and tokens per tenant and per model; top queries and top misses rank where value concentrates and where pre-warming would pay. The misses list doubles as a roadmap for your docs team.",
      "Safety and pressure round out the picture: anti-poisoning rejections by stage characterize what your traffic drags in; memory, block-cache, and SSTable-level gauges narrate capacity; license state sits in the corner being uneventful, as licenses should.",
      "Everything mirrors to Prometheus for your real estate, but the built-in view costs zero setup and answers the only question that matters on day one: is this thing earning? It is, and it shows its math.",
    ],
    chart: "read-path",
  },
  {
    slug: "incident-runbook",
    title: "The world's shortest cache runbook",
    date: "2026-05-14",
    tag: TAG,
    summary:
      "Fail-open design means most 'incidents' are the absence of savings, not the presence of errors. Here's the whole decision tree, which fits on an index card.",
    paras: [
      "Runbook length measures architectural fear, and ours is short on purpose. Symptom one: hit rate dropped. Check the dashboard's top misses, usually a traffic shift (new product launch, new question genre) doing exactly what it should; pre-warm if it matters, shrug if it doesn't. The cache underperforming is a cost regression, not an outage.",
      "Symptom two: Crowkis is unreachable. Your get_or_compute calls fall through to the provider, the app keeps working at pre-cache prices while you docker restart and the WAL replays the corpus intact. The failure mode of the savings layer is the absence of savings; we consider this the only acceptable failure mode for something in your hot path.",
      "Symptom three: something looks wrong with a specific answer. crowkis why <key> explains the serving decision, which gates passed, at what scores; crowkis dump shows the entry; the ledger shows its write history; Enterprise Live Edit corrects or kills it in place, audited. Investigation is built into the CLI, not reconstructed from logs.",
      "That's the card. crowkis doctor covers the diagnostics, the durability drill is pre-run on every release, and the pager stays quiet, the entire operational ambition of this product is to be the component nobody talks about in retros.",
    ],
    plain:
      "If the cache has a problem, your app keeps working, you just pay full price until it's back. That's the whole disaster scenario, and it's why the runbook fits on a card.",
    chart: "read-path",
  },
  {
    slug: "boring-on-purpose",
    title: "Boring on purpose: the operational philosophy",
    date: "2026-05-11",
    tag: TAG,
    summary:
      "Exciting infrastructure is a contradiction in terms. Every Crowkis design decision optimizes for the same review: 'it just runs.'",
    paras: [
      "Infrastructure has exactly one five-star review, 'we never think about it', and every architectural choice in Crowkis was audited against that sentence. One binary, because fleets of services are conversation generators. One compaction strategy, because tuning surfaces are pager bait. Stable disk format, because migrations are meetings. Fail-open everything, because a cache that can take down an app has misunderstood its job.",
      "The intelligence inside is genuinely intricate, twelve intent classes, five-stage trust, geometric-mean gates, but intricacy is our maintenance burden, not yours. The operator-facing surface is a container, a volume, two optional credentials, and a dashboard. Complexity that leaks onto the operator is just incomplete engineering wearing a feature's name.",
      "Even the excitement we do generate is curated to be the good kind: the saved-spend counter climbing, the hit rate settling onto a plateau, a model migration that nobody noticed happened. The dashboard exists so the cache's one story, money not spent, gets told without anyone being paged into hearing it.",
      "We measure success by absence: absent incidents, absent runbook pages, absent line items, absent thoughts. Build a component worth forgetting, and you've built the only kind that survives a re-architecture review. That's the whole philosophy. It's very boring. You're welcome.",
    ],
    plain:
      "The highest compliment for infrastructure is silence. Crowkis is engineered to earn it, intricate inside, invisible outside.",
    chart: "drop-in",
  },
];
