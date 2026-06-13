import { PostSpec } from "./builder";

const TAG = "use cases";

export const useCaseSpecs: PostSpec[] = [
  {
    slug: "support-bots-cache-goldmine",
    title: "Support bots are the single best caching workload in software",
    date: "2026-06-07",
    tag: TAG,
    summary:
      "Nowhere else do thousands of people ask the same fifty questions, all day, in every phrasing imaginable. Crowkis was practically designed in a support queue.",
    paras: [
      "Open any support transcript archive and the pattern leaps out: refunds, password resets, shipping windows, plan changes — the same fifty intents wearing thousands of phrasings. A support LLM without semantic caching purchases the refund-policy answer hundreds of times a day, at full token price and full multi-second latency, because each customer spells it differently.",
      "Crowkis turns that head of the distribution into sub-millisecond hits. Intent classification recognizes the factual question, the template abstracts away order numbers and dates, the vector index finds the canonical answer, and the confidence gate confirms the match before a byte is served. The customer gets an instant answer; your invoice gets nothing.",
      "Safety matters double in support, because mistakes face customers directly. The gates earn their keep here: 'cancel my account' never serves the cached 'pause my account' answer, tenant walls keep client A's policy out of client B's chat, and freshness policies expire the old pricing the moment you change it.",
      "Teams running support traffic see the highest hit rates we measure — repetition is the workload's nature. If you deploy Crowkis on exactly one thing, deploy it here, and watch the dashboard pay for the afternoon by dinner.",
    ],
    plain:
      "Your support bot answers the same questions all day. Crowkis makes the repeats free and instant, and only the genuinely new questions reach the model.",
    chart: "repeat-bill",
  },
  {
    slug: "internal-copilots-shared-memory",
    title: "Internal copilots: your whole company asks the same questions",
    date: "2026-06-04",
    tag: TAG,
    summary:
      "HR policy, expense rules, deploy commands, VPN setup — every employee rediscovers them through your copilot, billed per discovery. Give the company one memory.",
    paras: [
      "Internal copilots have a beautiful, expensive property: organizational questions are shared. When one engineer asks 'how do I rotate the staging certs?', four hundred colleagues will ask some phrasing of it this quarter. Without a semantic cache, the company purchases that institutional answer four hundred separate times from a model that said it perfectly the first time.",
      "Crowkis makes the copilot's knowledge cumulative. The first answer to each intent is computed; every paraphrase after — across Slack bots, IDE plugins, the internal portal, whatever speaks to the cache — lands as a hit. One shared engine behind every internal tool means the marketing team's question warms the answer for sales.",
      "The control plane fits corporate reality: tenant isolation separates departments where confidentiality demands it, PII scrubbing keeps personal details out of shared entries, and the live feed shows compliance exactly what was served and why. Budgets per virtual key keep any one team's enthusiasm from surprising finance.",
      "Internal tools rarely get infrastructure love because they don't face customers. This one's different: the payback is the headcount-times-repetition of your whole org chart, and the deployment is a single container your platform team already knows how to run.",
    ],
    chart: "agent-fanout",
  },
  {
    slug: "rag-apps-cache-the-synthesis",
    title: "RAG apps: cache the synthesis, not just the retrieval",
    date: "2026-06-03",
    tag: TAG,
    summary:
      "Your vector store finds the chunks fast. Then the model re-synthesizes the same answer from the same chunks, thousands of times. That second step is the bill.",
    paras: [
      "RAG teams optimize retrieval relentlessly — better chunking, better embeddings, rerankers — and then hand the retrieved context to the model to synthesize an answer that was synthesized identically an hour ago. Retrieval is milliseconds and cheap; synthesis is seconds and dominates the invoice. The cacheable step is the one nobody caches.",
      "Crowkis slots in at exactly that seam: before retrieval even runs, the incoming question is checked against previously synthesized answers by meaning and structure. A hit skips the entire pipeline — retrieval, ranking, synthesis — and returns in under a millisecond. A miss proceeds normally, and the fresh synthesis is banked for every future paraphrase, gated by the trust pipeline on its way in.",
      "Freshness control answers the obvious objection — 'my documents change.' TTL policies and version pinning tie cached syntheses to corpus versions; update the docs, invalidate the affected entries via webhook, and stale answers die before they're served. The cache respects your data's lifecycle instead of fighting it.",
      "The result is a RAG app that gets faster and cheaper with use, because popular questions stop costing anything. Retrieval was never your problem. The receipt for synthesis was.",
    ],
    plain:
      "RAG answers the same popular questions from the same documents over and over. Crowkis remembers the finished answer, so the expensive last step stops repeating.",
    chart: "read-path",
  },
  {
    slug: "agent-fleets-token-furnaces",
    title: "Agent fleets are token furnaces. Crowkis is the heat exchanger.",
    date: "2026-05-31",
    tag: TAG,
    summary:
      "Agents re-ask, re-plan, and re-fetch with industrial enthusiasm. Multiply by a fleet and you get the most cacheable traffic in existence — if the cache understands agents.",
    paras: [
      "Watch an agent fleet's traffic and the repetition is almost comic: five agents independently asking for the same schema, planners re-deriving the same step decomposition, tool wrappers re-fetching results that were deterministic the first time. Agents don't get embarrassed about asking again. At scale, that shamelessness is a furnace burning tokens around the clock.",
      "Crowkis was built with this traffic in mind. Semantic matching collapses the fleet's paraphrased fan-out into single computations. Reasoning reuse recycles the planning skeletons — the most expensive tokens agents emit. The Enterprise tool-call cache replays deterministic tool results instead of re-running them, and the conversation cache keeps multi-turn state from being re-purchased turn by turn.",
      "The safety net matters more for agents than for chat: agents write back what they conclude, and an agent's hallucination must not become the fleet's shared belief. Every agent write faces the same five-stage trust pipeline as everything else, with source-trust history per writer — a noisy agent earns a higher bar automatically.",
      "Per-key budgets complete the picture: each agent gets a virtual key with hard TPM and dollar walls, so a loop that escapes its loss function hits a wall instead of your card. Fleets without a cache are a cost incident on a schedule; fleets with Crowkis are economical by construction.",
    ],
    chart: "agent-fanout",
  },
  {
    slug: "coding-assistants-mcp",
    title: "AI coding assistants: the cache your team didn't know it was sharing",
    date: "2026-05-27",
    tag: TAG,
    summary:
      "Every developer on your team asks the assistant the same questions about the same codebase. With Crowkis behind MCP, the second ask is free for everyone.",
    paras: [
      "Coding assistants have a team-shaped repetition pattern: everyone works in the same repository, hits the same APIs, and asks the same 'how does our auth middleware work?' within days of each other. Each developer's assistant dutifully re-purchases the explanation, because their sessions share nothing. The codebase is common; the memory isn't.",
      "Crowkis behind MCP fixes the sharing: crowkis mcp registers the cache as a tool in Claude Code or any MCP-capable assistant, and lookups happen before tokens burn. One developer's answered question becomes the whole team's sub-millisecond hit — doc lookups, error explanations, dependency questions, the lot.",
      "Stale-code worries are handled the way everything here is handled: explicitly. Tie TTLs to repo activity, invalidate entries for changed files via webhook, and let the freshness gate decay confidence on aging explanations. An explanation of code that changed yesterday won't clear the gate today.",
      "Setup is one config block and the binary you already run for your app traffic — the same Crowkis instance happily serves both. Your assistants get collective memory; your token bill gets a team discount it never had.",
    ],
    plain:
      "Ten developers, one codebase, ten separate token bills for the same questions. MCP plus Crowkis turns that into one bill and nine instant answers.",
    chart: "agent-fanout",
  },
  {
    slug: "ecommerce-assistants",
    title: "E-commerce assistants: catalog questions on repeat, margins on the line",
    date: "2026-05-24",
    tag: TAG,
    summary:
      "Shipping times, return windows, size guides, 'does this come in blue?' — commerce traffic is seasonal, spiky, and gloriously repetitive. Cache accordingly.",
    paras: [
      "Commerce assistants live on a short menu of intents: availability, shipping, returns, sizing, compatibility, care instructions. Customers phrase them infinitely; the answers barely move between catalog updates. Paying frontier-model prices to re-explain your return window forty thousand times in November is margin erosion dressed up as innovation.",
      "Crowkis's template matching is unusually effective here because product queries are structurally identical with different entities: 'does the AX-200 ship to Canada?' and 'does the BX-300 ship to Germany?' share a template with different slots. Structural plus semantic matching catches the repetition that pure embeddings blur, with the confidence gate keeping distinct products distinct.",
      "Freshness is the commerce-specific superpower: tie TTLs to catalog and policy versions, fire invalidation webhooks on price or stock changes, and the holiday-sale answer dies the moment the sale does. Smart eviction protects the expensive long-tail answers while the seasonal head churns safely.",
      "Black Friday is the stress test caching was invented for — traffic multiplies, questions converge, and every cached hit is both saved spend and saved seconds at the moment your infrastructure and your customers are most impatient. Warm the cache before the surge; the dashboard will narrate the payoff live.",
    ],
    chart: "repeat-bill",
  },
  {
    slug: "edtech-tutors",
    title: "EdTech tutors: a thousand students, one curriculum, one cache",
    date: "2026-05-21",
    tag: TAG,
    summary:
      "Every cohort asks why the quadratic formula works. Teach the model once per concept, not once per student — while keeping personalized work personal.",
    paras: [
      "Educational workloads have a built-in repetition engine called a syllabus: every student walks the same concepts in roughly the same order, asking 'explain photosynthesis like I'm twelve' in a thousand voices. Conceptual explanation is the most re-purchased content in EdTech, and it's identical work every time.",
      "Crowkis's intent classes do the crucial sorting here. Factual and conceptual questions cache aggressively — the explanation of mitosis is the explanation of mitosis. Personalized feedback on a student's essay classifies differently and gets strict thresholds, so individual work stays individual. The cache accelerates the curriculum without homogenizing the coaching.",
      "Reasoning reuse fits worked examples beautifully: the solution structure for one quadratic transfers to the next with different coefficients, which is precisely the slot-abstraction the reasoning store performs. Step-by-step math help becomes a template hit with fresh numbers instead of a fresh derivation bill.",
      "The economics decide product scope in EdTech — unit costs per student determine what you can offer free tiers. A cache that drops conceptual-question costs toward zero is the difference between a demo and a freemium business.",
    ],
    plain:
      "The curriculum repeats by design, so the questions repeat by design. Cache the explanations, personalize the feedback, and your cost per student stops scaling with curiosity.",
    chart: "read-path",
  },
  {
    slug: "healthcare-hipaa-caching",
    title: "Healthcare AI: caching under HIPAA without holding your breath",
    date: "2026-05-18",
    tag: TAG,
    summary:
      "Clinical-adjacent assistants repeat administrative and informational answers constantly — but every cached byte is regulated. This is what compliance-mode caching looks like.",
    paras: [
      "Healthcare LLM traffic splits cleanly: a regulated personal layer (anything touching a patient's data) and a massively repetitive informational layer — coverage questions, prep instructions, medication-class explanations, scheduling policy. The second layer is ideal caching terrain, if and only if the cache can prove it never confuses the layers.",
      "Crowkis's architecture is the proof. Intent classification routes personal queries to strict no-reuse handling; PII scrubbing and the privacy-aware pipeline keep identifiers out of shared entries; tenant isolation is a scored write-gate, not just a read filter. The Enterprise HIPAA compliance mode presets retention, audit, and erasure behavior to the regime's expectations.",
      "Auditability is the difference between 'we think it's fine' and a passed review: every serve and refuse lands in the persistent audit log with the deciding stage attached, erasure workflows are API-driven and reportable, and the whole system runs inside your network — air-gapped if your security posture says so — with nothing phoning anywhere.",
      "Caching in healthcare isn't reckless; uncached it's just expensively slow at telling patients what time the clinic opens. Do it with machinery built for the constraint, and the savings arrive with receipts your compliance officer can file.",
    ],
    chart: "write-trust",
  },
  {
    slug: "fintech-assistants",
    title: "Fintech assistants: fast answers, frozen correctness",
    date: "2026-05-15",
    tag: TAG,
    summary:
      "Money questions repeat endlessly and tolerate zero staleness. Fintech is where freshness control stops being a feature and becomes the product.",
    paras: [
      "Fintech support traffic is repetitive the way all support is — fee schedules, transfer times, limit explanations, statement questions — but with a regulator watching the answers. A cached fee answer that survived yesterday's pricing change isn't a bug; it's a remediation letter. Most caches treat staleness as a tuning knob. Here it's a compliance boundary.",
      "Crowkis treats freshness as a first-class gate: five TTL policies, version pinning that ties entries to your published terms, invalidation webhooks fired from your pricing pipeline, and freshness decay inside the confidence score itself — an aging answer slides toward recompute before it can mislead. Change the fee schedule and the affected cache entries are dead before the announcement email sends.",
      "The trust pipeline carries the other fintech burden: answer provenance. Source-trust scoring and the append-only ledger mean every served answer has a traceable history, and Enterprise's audit export turns 'why did the bot say that?' into a query instead of an investigation.",
      "The payoff profile is steep because finance queries cluster hard around a small intent set. High repetition, high stakes, high savings — provided the cache was engineered by people who find staleness genuinely frightening. Ours were.",
    ],
    plain:
      "In fintech a stale cached answer is a compliance incident. Crowkis ties every answer's lifetime to your actual policy versions, so speed never outruns correctness.",
    chart: "write-trust",
  },
  {
    slug: "government-airgap",
    title: "Government and defense: the cache that works where the internet doesn't",
    date: "2026-05-12",
    tag: TAG,
    summary:
      "Air-gapped networks, FedRAMP postures, and zero phone-home tolerance rule out most AI infrastructure on page one. Crowkis was designed to pass that page.",
    paras: [
      "Public-sector AI deployments start with an elimination round: anything that requires a cloud account, sends telemetry, validates licenses online, or ships a sprawling dependency tree is out before capabilities are even discussed. Most of the LLM tooling ecosystem — cloud gateways, managed caches, Python proxies — exits here.",
      "Crowkis survives the round by construction: a single signed Rust binary, offline Ed25519 license verification, zero telemetry, zero phone-home, full function on networks that have never seen the public internet. The supply-chain story fits the same posture — there is no package tree to audit because there are no packages, just one file and its signature.",
      "Inside the gap, the mission profile is classic caching: analyst tools and internal assistants over fixed document corpora generate intensely repetitive query loads, and every model call on constrained or accredited compute is precious. Semantic hits at sub-millisecond latency stretch scarce inference capacity exactly where it can't be casually scaled.",
      "FedRAMP-aligned compliance mode, persistent audit logs, and RBAC complete the accreditation paperwork's wish list. This deployment class is usually an afterthought for vendors. It was a design input for us.",
    ],
    chart: "supply-chain",
  },
  {
    slug: "saas-multitenant",
    title: "Multi-tenant SaaS: one cache, many customers, zero leaks",
    date: "2026-05-09",
    tag: TAG,
    summary:
      "Caching across customers multiplies savings and multiplies risk. Tenant isolation has to be architecture, not a WHERE clause.",
    paras: [
      "SaaS platforms embedding LLM features face a sharp dilemma: per-tenant caches waste the repetition that crosses customers (everyone asks how exports work), while a shared cache risks the unforgivable — customer A's answer surfacing in customer B's session. Most teams resolve it by not caching, which resolves it by overpaying.",
      "Crowkis dissolves the dilemma with namespacing as physics: every entry carries its tenant, lookups cannot cross the wall, and isolation is additionally scored at write time, so an entry that smells cross-tenant never enters the cache at all. Platform-level content can live in a deliberate shared tenant; customer-specific answers stay locked to their namespace.",
      "The control plane speaks SaaS fluently: per-tenant hit rates and savings in the dashboard (your customers' ROI story, ready-made), per-tenant budgets that turn AI features into governable line items, and Enterprise virtual keys that let you meter your own customers' usage with hard walls.",
      "Community edition covers your first three tenants free — a startup-friendly on-ramp — and the Enterprise license removes the ceiling when your logo wall grows. The leak you never have is the feature you'll never see in the dashboard, which is exactly the point.",
    ],
    plain:
      "Share the cache's savings across customers without ever sharing the answers. The tenant wall is enforced when entries are written, not just when they're read.",
    chart: "write-trust",
  },
  {
    slug: "startups-runway",
    title: "Startups: your LLM bill is eating runway you'll want back",
    date: "2026-05-06",
    tag: TAG,
    summary:
      "Seed-stage AI products routinely spend salary-sized sums recomputing known answers. Free Community edition exists precisely for this moment of your company.",
    paras: [
      "Early AI startups share a financial signature: model spend grows faster than revenue, because every user interaction bills tokens whether or not it creates value. The repeated fraction of that spend — often the majority once a product finds its core loops — is pure runway leakage. Months of survival, paid to a provider for answers already given.",
      "Crowkis Community is free at exactly your scale: full engine, all seven systems, up to three tenants and 100K entries, no license, no sign-up, no usage meter waiting to ambush your growth. The deployment is one container next to your app; the integration is one wrapper around your model call. An afternoon, generously.",
      "The latency dividend may matter even more than the cost one: sub-millisecond answers on repeated questions make a thin product feel fast, and fast products convert. You're not just saving spend; you're buying the UX of a company with better infrastructure than you can afford engineers for.",
      "Spend runway on experiments that find product-market fit, not on re-purchasing Tuesday's answers on Wednesday. The free tier exists because we'd rather you grow into a call with us than die before one.",
    ],
    chart: "repeat-bill",
  },
  {
    slug: "enterprise-platform-teams",
    title: "Platform teams: make caching a paved road, not a per-team adventure",
    date: "2026-05-03",
    tag: TAG,
    summary:
      "Every product team is duct-taping its own LLM cache right now. Platform engineering exists to end exactly this kind of duplication.",
    paras: [
      "Inside any large org adopting LLMs, the same scene repeats per team: someone writes a dedup script, someone wires a vector store, someone files the 'cache poisoning?' ticket nobody owns. Five teams, five half-caches, zero shared learning, and the org's aggregate question corpus — its most cacheable asset — fragmented into puddles.",
      "Crowkis is the paved road version: one cluster (or a few, by isolation needs) operated by platform, consumed by every team over RESP, gRPC, REST, or MCP with golden-path SDK snippets. Virtual keys give each team budgets and rate walls; tenants give them isolation; the dashboard gives platform the org-wide savings number that justifies the road.",
      "Operationally it behaves like the infrastructure you already run: one hardened container per cluster, Prometheus and OTel into your existing observability, binary-swap upgrades, health checks for your orchestrator. No new operational genre to learn — deliberately.",
      "The compounding is the prize: every team's traffic warms every other team's hits, institutional answers accrue in one place, and the next team to add an LLM feature starts with a warm cache on day one. That's what paved roads are for.",
    ],
    chart: "drop-in",
  },
  {
    slug: "high-traffic-chat",
    title: "Consumer chat at scale: when every millisecond and every token multiply",
    date: "2026-04-30",
    tag: TAG,
    summary:
      "At consumer scale, traffic converges on shared intents while costs and latency multiply by millions. The cache becomes load-bearing infrastructure.",
    paras: [
      "Consumer products discover a statistical gift at scale: the bigger the user base, the more traffic converges on shared questions. Million-user apps see enormous intent overlap — news, how-tos, recommendations, the day's viral question asked a hundred thousand ways. Scale makes caching more valuable precisely as it makes everything else harder.",
      "Crowkis's engine specs were chosen for this regime: sub-millisecond hits from an in-process Rust read path with no GC pauses, 10K-connection ceilings per instance, and an actor architecture that keeps tail latencies flat under concurrency. The hot head of your distribution gets served at memory speed while only the genuinely novel tail touches models.",
      "Smart eviction earns its keep at consumer cache sizes: recency, frequency, isolation, and compute-cost scoring keep the corpus dense with answers worth keeping, while the soft-capped Community or uncapped Enterprise tiers absorb growth. Streaming hits via CGETSTREAM preserve the typing-effect UX users expect, straight from cache.",
      "At this scale the cache stops being an optimization and becomes capacity planning: every point of hit rate is provider capacity you don't need to procure and latency budget you hand back to the product. Treat it as load-bearing, because it is.",
    ],
    chart: "read-path",
  },
  {
    slug: "voice-assistants-latency",
    title: "Voice assistants: caching as a conversational necessity",
    date: "2026-04-27",
    tag: TAG,
    summary:
      "Voice gives you about a second before silence feels broken. Model round-trips don't fit. Cache hits do — with room to spare for the speech stack.",
    paras: [
      "Voice interfaces live under a brutal latency budget: ASR, understanding, synthesis, and playback all share roughly a second before users perceive the assistant as broken. A multi-second LLM round-trip blows the budget on its own. For repeated intents — which dominate voice traffic's command-like distribution — that spend of time and tokens is doubly absurd.",
      "Crowkis hands voice stacks their latency budget back: semantic hits return in under a millisecond, leaving nearly the whole second for speech processing. 'What's on my calendar', 'play the news', 'how do I get downtown' and their endless phrasings become instant, while only genuinely novel requests wait on a model.",
      "Voice phrasing variability is the semantic layer's home turf: spoken language is messier than typed, ASR adds its own noise, and exact matching is hopeless — but intent plus template plus embedding matching was built for exactly this looseness, with the confidence gate guarding against the looseness becoming wrongness.",
      "Streamed cache hits complete the illusion: CGETSTREAM feeds the TTS chunk by chunk, so the assistant starts speaking immediately and naturally. Users call the product 'snappy.' The dashboard calls it a 90th-percentile latency you didn't have to engineer twice.",
    ],
    plain:
      "Voice users wait one second, max. Models take longer than that. The cache is how repeated requests answer instantly enough to feel like conversation.",
    chart: "read-path",
  },
  {
    slug: "translation-localization",
    title: "Translation pipelines: the same strings, the same languages, every release",
    date: "2026-04-24",
    tag: TAG,
    summary:
      "Product copy, help docs, and templates get re-translated continuously as releases churn. Most of the content didn't change. Stop paying as if it did.",
    paras: [
      "LLM translation workflows have an industrial repetition pattern: every release cycle re-feeds largely unchanged strings — UI copy, help articles, email templates — through translation for every supported locale. The deltas are small; the re-translation bills are not. Multiply by twenty languages and the redundancy becomes a budget line.",
      "Crowkis collapses the redundancy at the string-and-context level: identical and near-identical source strings hit cached translations instantly, while the template engine handles the parametric cases — 'Your order {n} ships {date}' translates once per locale, with slots, forever. Only genuinely new or edited content reaches the model.",
      "Quality consistency comes free with the savings: cached translations are frozen good translations, so your French stays the same French across releases instead of drifting with model temperature. Version-pinned freshness ties entries to glossary and style-guide versions, and a glossary update invalidates exactly the affected entries.",
      "The migration workflow even covers model upgrades — when you move to a better translation model, canary it, compare, and migrate the corpus deliberately instead of losing years of locked-in phrasing overnight. Localization managers cry at that feature, in the good way.",
    ],
    chart: "migration",
  },
  {
    slug: "summarization-pipelines",
    title: "Summarization at scale: the same documents keep getting summarized",
    date: "2026-04-21",
    tag: TAG,
    summary:
      "Reports, tickets, calls, and articles get summarized on every view, by every viewer, in every digest. The document didn't change between viewers. The bill did.",
    paras: [
      "Summarization workloads repeat along a sneaky axis: not identical queries, but identical inputs. The Monday metrics report gets summarized for every executive who opens it; the same support ticket gets condensed in every escalation view; the same earnings call gets digested by every analyst's feed. Same document, same model work, n times.",
      "Crowkis catches input-repetition naturally — the document's content hashes into the match, so 'summarize this report' over identical bytes is a perfect hit regardless of who's asking or how they phrase the wrapper. Multimodal support extends the same logic to image-bearing inputs via CIMGGET.",
      "Parametric summaries — 'three bullets for execs' versus 'a paragraph for the team' — stay distinct through structural templating: the instruction shape is part of the match, so formats don't bleed into each other while each format caches independently. Freshness ties summaries to document versions; edit the doc, the stale summary dies.",
      "Reasoning reuse adds a deeper cut for recurring document types: the summarization approach for your weekly-report format gets extracted once and recomposed across instances. The model learns the shape of your Mondays exactly once.",
    ],
    plain:
      "When ten people view the same report, the summary should be computed once, not ten times. Crowkis recognizes the repeated document, not just repeated words.",
    chart: "repeat-bill",
  },
  {
    slug: "classification-pipelines",
    title: "Classification and extraction: high-volume, low-variance, born to be cached",
    date: "2026-04-18",
    tag: TAG,
    summary:
      "Routing tickets, tagging content, extracting fields — LLM classification runs millions of small calls over heavily repeating inputs. The cache hit rate is absurd, in your favor.",
    paras: [
      "Teams increasingly use LLMs as classifiers — route this ticket, tag this listing, extract these invoice fields — because setup is instant and quality is strong. The traffic profile is extreme: enormous volume, tiny outputs, and inputs that cluster brutally. Half of all support tickets are minor variations of the same forty complaints; product listings repeat structures endlessly.",
      "This is the easiest money in caching. Near-duplicate inputs hit semantically; structurally identical inputs hit via templates ('invoice from {vendor} dated {date}' is one pattern, infinite instances); and classification outputs are tiny, so the corpus stays compact while the call volume it absorbs is huge.",
      "Stability is a hidden quality win: cached classifications are deterministic, so the same input never flips labels with model mood — the consistency your downstream automation quietly assumed it had. Confidence gating still routes ambiguous novel inputs to the model, where judgment is actually needed.",
      "Run the math on your pipeline: calls per day, times repeat fraction, times unit price. For classification workloads the repeat fraction is usually the biggest number you'll see this quarter. The dashboard will confirm it within a day.",
    ],
    chart: "read-path",
  },
  {
    slug: "documentation-assistants",
    title: "Docs assistants: your documentation has a top-40 chart",
    date: "2026-04-15",
    tag: TAG,
    summary:
      "Every docs site has the same hit parade — auth, rate limits, pagination, that one confusing endpoint. The assistant answering them should not bill like a consultant.",
    paras: [
      "Instrument any documentation assistant and a leaderboard emerges immediately: a top-40 of questions — authentication setup, rate limits, webhook retries, the endpoint everyone misreads — absorbing the overwhelming share of traffic. The docs are stable; the questions are stable; only the phrasing churns. It's the purest caching workload after support.",
      "Crowkis turns the leaderboard into a free tier of your own: top questions become permanent sub-millisecond hits in every phrasing, gated for confidence so adjacent endpoints never cross-serve. The top-misses analytics view doubles as docs feedback — questions that keep missing are sections your documentation hasn't written yet.",
      "Docs versioning maps directly onto freshness control: pin cache entries to doc versions, invalidate on publish, and let v2 answers die the day v3 ships. The assistant stays exactly as current as the documentation, automatically, which is the entire trust contract of a docs bot.",
      "Developer-experience teams justify budgets with deflection and satisfaction numbers; the dashboard hands you both, plus a savings figure. The top-40 chart was always going to exist — the only question is whether you pay royalties on every play.",
    ],
    plain:
      "A handful of questions dominate every docs site. Cache them once, serve them forever, and let the misses list tell you what to document next.",
    chart: "repeat-bill",
  },
  {
    slug: "search-and-qa-products",
    title: "Answer-engine products: when the answer is the product, margin is the moat",
    date: "2026-04-12",
    tag: TAG,
    summary:
      "If your product is answering questions, your COGS is the model bill and your UX is the latency. The cache moves both — which makes it strategy, not plumbing.",
    paras: [
      "For answer-engine products — vertical search, research assistants, Q&A over specialized corpora — the LLM call isn't a feature's cost, it's the cost of goods sold. Every margin point and every latency percentile is competitive surface. The companies that win this category will be the ones whose repeated answers cost nothing to serve.",
      "Query convergence is the category's gravity: within any vertical, users orbit the same canonical questions with personal phrasing. Crowkis converts that gravity into unit economics — the popular head serves from cache at near-zero marginal cost, while spend concentrates on the novel tail where your product actually differentiates.",
      "Quality control is built into the serving path rather than bolted on: confidence gates keep uncertain matches away from users, freshness keeps time-sensitive verticals honest, and Enterprise Live Edit lets your team correct a cached answer in place the moment quality review flags it — with the change audited.",
      "Watch the dashboard's economics shift as the corpus warms: cost per answered question falls week over week while p50 latency collapses. That curve is your pitch deck's favorite slide, and it compounds while you sleep.",
    ],
    chart: "read-path",
  },
];
