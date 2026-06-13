import { PostSpec } from "./builder";

const TAG = "economics";

export const economicsSpecs: PostSpec[] = [
  {
    slug: "token-math-of-repetition",
    title: "The token math of repetition: what your duplicate questions actually cost",
    date: "2026-06-06",
    tag: TAG,
    summary:
      "Take your daily query volume, multiply by the repeat fraction, multiply by your blended price per call. That number, twelve times a year, is the cache argument.",
    paras: [
      "Most teams have never run the three-number multiplication that justifies caching. Daily LLM calls, times the fraction that are semantic repeats of earlier calls, times your blended cost per call. A modest product doing 200,000 calls a day with a 45% repeat fraction at a cent per blended call is leaking nine hundred dollars daily — a fully loaded engineer's salary, annually, spent re-purchasing known answers.",
      "The repeat fraction is the number everyone underestimates, because exact-match thinking hides it. Byte-identical repeats might be 3% of traffic; semantic repeats — same intent, different words — routinely land between 30% and 70% depending on workload. Support and docs sit at the top; agent fleets sometimes exceed it. You cannot see this fraction in logs without semantic analysis, which is why it survives unexamined.",
      "Crowkis makes the math visible and then makes it stop: the dashboard's saved-spend counter is the multiplication running live against your actual traffic, and Enterprise's Replay runs it retroactively on a sample before you commit to anything. No projections — your data, your prices, your number.",
      "Run the multiplication this week, even on a napkin. Every month it stays unrun is a month the answer compounds against you. The cache deploys in five minutes; the leak has been billing since launch.",
    ],
    plain:
      "Your bill = new questions + repeated questions. The repeated half can cost almost nothing. Most teams have simply never measured how big that half is.",
    chart: "repeat-bill",
  },
  {
    slug: "flat-pricing-philosophy",
    title: "Why Crowkis refuses to meter you",
    date: "2026-06-02",
    tag: TAG,
    summary:
      "A cache exists to make costs predictable. Metering the cache would be self-defeating. So Community is free and Enterprise is flat per cluster — priced on a call, not a meter.",
    paras: [
      "There's a quiet absurdity in the market: cost-reduction tools billed by usage, so the more they save you, the more they cost. A metered cache puts a tollbooth on your savings and re-introduces the exact anxiety — variable, traffic-coupled spend — that caching was hired to eliminate. We find this philosophically embarrassing, so we don't do it.",
      "Crowkis pricing has two shapes only. Community: free, forever, full engine, no license file, no sign-up, capped at a scale (3 tenants, 100K entries) where charging you would cost more goodwill than it earns. Enterprise: flat per cluster per year, settled in one conversation. Your millionth lookup costs what your first did — nothing marginal, ever.",
      "Flat pricing also changes how you build: no one architects around their cache's billing meter, no one rations lookups, no finance review flags the cache line item growing with success. The component fades into infrastructure, which is the highest compliment infrastructure can receive.",
      "The model is borrowed from the self-host greats — license file, offline verification, predictable renewals — because it aligns the vendor with the customer: we profit when you renew, and you renew when the thing quietly works. Meters align vendors with your traffic. We'd rather be aligned with your success.",
    ],
    chart: "budget-wall",
  },
  {
    slug: "replay-before-you-buy",
    title: "Replay: the demo that uses your data instead of our slides",
    date: "2026-05-30",
    tag: TAG,
    summary:
      "Every cache vendor promises a hit rate. Crowkis Replay computes yours — on your real queries, before you spend anything. The pitch is a number with your name on it.",
    paras: [
      "Infrastructure buying is plagued by projected ROI: vendor benchmarks on synthetic workloads that mysteriously flatter the vendor. We built Crowkis Replay specifically to exit that genre. Bring a sample of your real production queries to the demo call; we replay them through the full engine — intent classes, templates, confidence gates, everything — and hand you your actual hit rate and dollar savings.",
      "The honesty cuts both ways, which is the point. If your workload is genuinely novel-heavy — some are — Replay says so, and we'll tell you the cache earns less here. That costs us a deal and buys something more valuable: every number we ever show you afterward is credible. Infrastructure relationships run on exactly that currency.",
      "Mechanically it's simple: export a query sample (no responses needed — Crowkis computes what it would have served and what the misses would have cost at your model prices), thirty minutes on a call, and you leave with the multiplication done by your own traffic.",
      "The ask is one email to license@crowkis.io with 'Replay' in the subject. The worst case is a free, rigorous analysis of your LLM spend's shape. The usual case is the easiest infrastructure approval you'll file this year.",
    ],
    chart: "read-path",
  },
  {
    slug: "budget-circuit-breakers",
    title: "Budgets with teeth: why your LLM spend needs a circuit breaker",
    date: "2026-05-26",
    tag: TAG,
    summary:
      "Every team has a runaway-loop story that ends with a shocking invoice. Per-key budgets with hard TPM and dollar walls end the genre.",
    paras: [
      "The runaway-spend incident has become an industry folk tale because it keeps happening: a retry loop without backoff, an agent stuck re-planning, a load test pointed at production keys — discovered not by an alert but by an invoice with an extra digit. Provider-side spending caps are monthly and coarse; the damage window is hours and fine-grained.",
      "Crowkis Enterprise puts the wall where the traffic is: virtual API keys, one per app, team, agent, or customer, each with hard dollar budgets and TPM/RPM ceilings enforced locally, in-line, before the request leaves your network. The loop hits the wall at its key's limit, an alert fires to Slack, and every other key keeps working untouched.",
      "Granularity is the feature: the experimental agent gets a small budget, the production support bot gets headroom, the intern's prototype gets a sandbox allowance — and finance gets a dashboard where AI spend decomposes by key instead of arriving as one undifferentiated provider invoice.",
      "Caching cuts the spend you meant to make; budgets cap the spend you didn't. Together they turn LLM costs from a monthly surprise into a governed system — which is what 'taking AI to production' was supposed to mean all along.",
    ],
    plain:
      "A bug in a loop can spend a month's budget in an afternoon. Per-key walls mean the bug hits a limit, not your card.",
    chart: "budget-wall",
  },
  {
    slug: "latency-is-money",
    title: "Latency is money: the second invoice nobody itemizes",
    date: "2026-05-23",
    tag: TAG,
    summary:
      "Every multi-second model wait is paid twice — once in tokens, once in user patience. The cache refunds both, but only one shows up in accounting.",
    paras: [
      "Teams justify caching with the token bill because it's legible — a number on an invoice. The latency bill is larger and invisible: seconds of user attention burned per repeated question, multiplied across every session, compounding into bounce rates, abandoned flows, and the vague product feedback that says 'it feels slow.' Conversion research has priced page-speed for two decades; LLM waits are the new page speed.",
      "Repetition makes the waste exquisite: the user waits three seconds for an answer your system generated this morning. The model isn't thinking — it's re-typing. Paying premium per-token prices for re-typing, delivered slowly, is the worst deal in your stack.",
      "Crowkis converts the repeated head of your traffic to sub-millisecond responses — not faster model calls, but the absence of a call. Users experience an assistant that answers common questions instantly, which reads as intelligence even though it's memory. Streaming hits preserve the familiar typing rhythm so the speed never feels uncanny.",
      "Put both refunds in the business case: the token savings your CFO can audit, and the latency savings your retention curves will quietly confirm. The second one is usually worth more. It's certainly worth more to your users.",
    ],
    chart: "read-path",
  },
  {
    slug: "caching-vs-smaller-models",
    title: "Before you downgrade the model, cache the good one",
    date: "2026-05-20",
    tag: TAG,
    summary:
      "Cost pressure pushes teams toward cheaper, dumber models. Caching offers the opposite trade: keep frontier quality, pay small-model prices on the traffic that repeats.",
    paras: [
      "The standard cost-reduction playbook reaches for a smaller model: accept a quality haircut everywhere, save per token. It's a real lever, but examine what it trades — every answer gets worse, including the novel ones where quality is the product. You've made the bill smaller by making the product smaller.",
      "Caching inverts the trade. The repeated head of traffic — where the frontier model's answer is already banked — serves at effectively zero cost, full quality. Spend concentrates on the novel tail, where the good model earns its price. Blended cost falls toward small-model territory while quality stays at the frontier where users can tell the difference.",
      "The math compounds with hit rate: at a 50% hit rate, your effective per-query cost halves with zero quality loss — equivalent to a 50%-cheaper model that's somehow exactly as good. No distillation project, no eval suite, no regression risk. One container.",
      "Enterprise's arbitrage router lets you do both deliberately: easy intents route to cheap models, hard ones to the frontier, all behind the cache. But the order of operations matters — cache first, downgrade only what the cache and the router prove can survive it.",
    ],
    plain:
      "A cheaper model makes every answer worse. A cache makes repeated answers free while keeping the good model. Try the free option first.",
    chart: "migration",
  },
  {
    slug: "agent-unit-economics",
    title: "Agent unit economics: making the per-task math survive contact with reality",
    date: "2026-05-17",
    tag: TAG,
    summary:
      "Agents multiply model calls per user action by 10–50x. Without aggressive reuse, the unit economics of agentic products simply don't close.",
    paras: [
      "Chat products spend one model call per user message; agents spend a planning call, several tool-selection calls, retries, reflections, and a synthesis — ten to fifty calls per task, each billed. Multiply by your task volume and many agentic business models are underwater before the demo ends. The category's dirty secret is that the unit economics rarely close at list prices.",
      "Crowkis attacks the multiplier at every joint: semantic caching collapses the fleet's repeated questions, reasoning reuse recycles planning skeletons (the priciest tokens agents emit), the tool-call cache replays deterministic tool results, and the conversation cache stops multi-turn context from being re-purchased turn by turn. The 10–50x multiplier deflates toward the irreducible novel core of each task.",
      "Per-key budgets make the economics governable per agent: each gets a virtual key with hard walls, so the cost of any agent is bounded by configuration rather than by hope. Finance can finally price a task with confidence intervals instead of incident reports.",
      "Teams shipping agents at sustainable margins all converge on the same architecture: a memory layer between the fleet and the providers. That layer is a product now. It deploys in five minutes.",
    ],
    chart: "agent-fanout",
  },
  {
    slug: "free-tier-economics",
    title: "Why Community is actually free: the honest economics of our free tier",
    date: "2026-05-14",
    tag: TAG,
    summary:
      "Full engine, production use, no license, no meter, no time bomb. Here's why giving the small end away is the rational structure, not a teaser.",
    paras: [
      "Free tiers earn suspicion because most are traps: crippled engines, trial clocks, or usage meters that detonate at success. Crowkis Community is none of these — all seven intelligence systems, every protocol, real production use, capped only at 3 tenants and 100K entries. The cap is scale, not capability. A solo developer or small team can run it forever and owe us nothing.",
      "The economics are honestly self-interested. Below the cap, you were never going to pay — charging you would only shrink the pool of people who know the product works. Above the cap, you're an organization with compliance needs, unlimited tenants, and a procurement process — and you'll arrive at that conversation already running Crowkis, already convinced by your own dashboard.",
      "The structure also disciplines us: Community users churn instantly if quality slips, so the free tier is a standing quality gate on every release. We can't ship a bad version and hide it behind a sales process. CockroachDB and Sentry proved this model builds better software, not just bigger funnels.",
      "So take the free tier at face value, in production, indefinitely. The only thing it costs is that one day, if you grow past three tenants, you'll already know exactly who to call.",
    ],
    chart: "drop-in",
  },
  {
    slug: "cfo-pitch",
    title: "The CFO pitch: explaining the cache to the person who signs things",
    date: "2026-05-11",
    tag: TAG,
    summary:
      "Three sentences, one dashboard number, and a flat price. The rare infrastructure purchase that finance understands faster than engineering does.",
    paras: [
      "Most infrastructure is hard to pitch upward because its value is counterfactual — outages that didn't happen. A cache is the blessed exception: its value is a counter, in dollars, on a dashboard, going up. The CFO version of Crowkis fits in three sentences: a large fraction of our AI spend re-purchases answers we already have; this component serves those answers for free instead; here is the live number it saves.",
      "The cost side is equally legible: zero (Community) or a flat annual figure per cluster (Enterprise, settled on a call). No usage meter means the line item never grows with adoption — the rarest property in modern SaaS, and the one finance teams remember you fondly for.",
      "The risk profile rounds to nothing: self-hosted (no new data processor for the privacy review), fail-open as a pass-through (worst case is the status quo), reversible in an afternoon, and provable in advance via Replay on your own traffic. Most line items this size carry more procurement weight than this entire deployment.",
      "Engineering buys Crowkis for the gates and the Rust. Finance buys it because it's the only AI line item whose job is making another line item smaller — with receipts. Bring the dashboard to the meeting; it does the talking.",
    ],
    plain:
      "Tell finance: 'We pay repeatedly for answers we already own. This box stops that. Here's the live savings number, and the box costs a flat fee.' Done.",
    chart: "repeat-bill",
  },
  {
    slug: "provider-arbitrage-economics",
    title: "Provider arbitrage: paying frontier prices only for frontier questions",
    date: "2026-05-08",
    tag: TAG,
    summary:
      "Model prices vary 50x for overlapping quality on easy queries. The arbitrage router exploits the spread automatically, with a quality bar you set per intent.",
    paras: [
      "The model market has a spread any trader would recognize: frontier models cost an order of magnitude more than mid-tier ones, but on easy intents — factual lookups, simple classification, boilerplate transformation — their outputs are indistinguishable. Routing everything to the frontier means paying caviar prices for toast. Routing everything to mid-tier means failing your hard queries. The money is in routing well.",
      "Crowkis Enterprise's arbitrage router does the routing with the cache's own intelligence: intent classification already grades query difficulty, so each query goes to the cheapest backend that clears your configured quality bar for that intent class. Easy traffic rides cheap models; genuinely hard reasoning rides the frontier; the bar, not vibes, decides.",
      "The cache stacks multiplicatively underneath: repeated queries don't route anywhere — they hit. The router only prices the novel residue, and the cross-provider bridge means answers cached from one backend serve traffic on another, so the arbitrage never fragments your memory.",
      "The combined effect on blended cost is dramatic and — unusually for cost work — quality-neutral by construction, since the bar is enforced per query. The spread is sitting there in every pricing page. Take it.",
    ],
    chart: "migration",
  },
  {
    slug: "cost-of-cold-starts",
    title: "The hidden invoice of a cold cache: what model migrations really cost",
    date: "2026-05-05",
    tag: TAG,
    summary:
      "Swap models with a normal cache and you re-purchase your entire corpus at the new model's prices. Migration leasing is the line item that prevents the line item.",
    paras: [
      "Model upgrades carry a cost nobody budgets: the cache wipe. Your corpus of answered questions — weeks of accumulated hits — assumes the old model, so the standard move is flush and rebuild. Every previously-free hit becomes a fresh model call at the new model's prices, concentrated into the weeks after launch. Teams notice the bill spike and blame the new model; the real culprit is the cold start.",
      "Crowkis treats the upgrade as a first-class workflow instead of a wipe: canary the new model on a traffic slice, compare quality against cached baselines, then migrate entries with leasing — old answers keep serving until their replacements are verified, so hit rate never cliffs and recomputation spreads across natural traffic instead of arriving as a spike.",
      "The strategic effect is bigger than the saved spike: cold-start dread is why teams postpone upgrades, running last year's model out of cache inertia. Make migrations cheap and you upgrade the moment a better model ships — which, lately, is quarterly.",
      "Count the cold start in every model decision, or better, make it stop existing. Your cache should be an asset that survives your choices, not a hostage to them.",
    ],
    plain:
      "Switching models normally deletes your savings and re-bills everything. Crowkis carries the warm cache across the upgrade, so better models stop being expensive decisions.",
    chart: "migration",
  },
  {
    slug: "roi-timeline",
    title: "The ROI timeline: hour one, week one, quarter one",
    date: "2026-05-02",
    tag: TAG,
    summary:
      "Caching ROI isn't a hockey stick — it's a staircase that starts the first hour. Here's the honest schedule of when each saving shows up.",
    paras: [
      "Hour one: deployment and first hits. The container is up in five minutes; the first semantic hit lands as soon as any question repeats — in support and docs workloads, usually within the hour. The dashboard's saved counter starts moving the same afternoon. This is the demo-to-yourself phase, and it costs nothing but the afternoon.",
      "Week one: the head of your distribution warms. Hit rate climbs as the corpus accumulates your canonical questions; latency percentiles visibly split into instant-hits and normal-misses. This is when the top-misses view starts directing pre-warming and when someone screenshots the savings number into Slack.",
      "Quarter one: the structural effects arrive. Budgets and keys turn AI spend into a governed system; a model upgrade happens without a cold start; the per-query blended cost in your unit economics quietly drops a tier and stays there. The cache stops being a project and becomes a number everyone assumes.",
      "The honest caveat: novel-heavy workloads climb the staircase slower, and Replay will tell you that in advance, free. For everyone else, the schedule above is boringly reliable — which is the best thing a cost curve can be.",
    ],
    chart: "repeat-bill",
  },
];
