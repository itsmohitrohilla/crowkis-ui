import { PostSpec } from "./builder";

/**
 * Feature deep-dives, one focused post per shipped Crowkis capability, written
 * for the engineer evaluating whether it fits their stack. Every command and
 * default named here exists in the product today.
 */

const TAG = "features";

export const featuresSpecs: PostSpec[] = [
  {
    slug: "cguard-input-guardrails",
    title: "CGUARD: an input guardrail that survives leetspeak and zero-width tricks",
    date: "2026-06-22",
    tag: TAG,
    summary:
      "Prompt injection rarely arrives in plain English. CGUARD normalizes the evasion first, whitespace, leetspeak, zero-width characters, then scans for jailbreaks, overrides, and system-prompt exfiltration.",
    paras: [
      "The naive prompt-injection filter loses to a five-minute workaround: insert a zero-width space, swap an 'o' for a '0', pad with newlines, and the regex that caught 'ignore previous instructions' sails right past 'ig​nore prev1ous 1nstructions'. CGUARD assumes the attacker knows this, so it normalizes before it matches, collapsing whitespace, folding leetspeak, stripping zero-width characters, and only then runs the scan.",
      "What it scans for is the real catalogue: DAN-style jailbreaks, developer-mode prompts, instruction overrides detected by verb-plus-noun co-occurrence rather than fixed strings, and attempts to exfiltrate the system prompt. The return is structured, a verdict, a category, and the matched span, so your app can log the category, show the user a clean refusal, and route the rest onward.",
      "It runs as a command, CGUARD, which means it composes anywhere: in front of a cache write, in front of a model call, or as a standalone gate in a pipeline that isn't even using Crowkis for caching yet. No model call, no egress, the detection is deterministic and local, so it costs microseconds and leaks nothing.",
      "A guardrail is only worth shipping if it assumes an adversary, not a typo. CGUARD is built for the person actively trying to break your agent, which is exactly the person a string-match filter was never going to stop.",
    ],
    plain:
      "Attackers disguise prompt injections with odd spacing and character swaps. CGUARD undoes the disguise first, then checks, so the trick that beats a simple filter doesn't beat this one.",
    chart: "write-trust",
  },
  {
    slug: "coutcheck-output-guardrails",
    title: "COUTCHECK: catching the PII leak and the toxic line before your user does",
    date: "2026-06-20",
    tag: TAG,
    summary:
      "The model's output is the other trust boundary. COUTCHECK scans responses for PII leakage and toxicity, and optionally validates JSON, returning a structured verdict you can act on.",
    paras: [
      "Input guardrails get the attention, but the response is where the damage actually ships. A model can echo a customer's email back into a shared answer, slip a toxic line into a support reply, or return malformed JSON that crashes the caller. COUTCHECK is the gate on the way out: it scans the output for leaked PII, for toxicity, and, when you ask, for JSON validity.",
      "The verdict is structured for action, not just observation: a pass/fail, the list of PII entities found, the toxic spans, and a JSON status. That shape lets you do the right thing per failure, redact the PII and continue, block the toxic response and regenerate, or reject the malformed JSON before it reaches a parser that would have thrown.",
      "Like its input-side sibling, COUTCHECK is model-free and zero-egress. It doesn't phone a moderation API with your users' content; the scan happens in-process, which keeps it fast enough to sit in the response path and private enough to run under a compliance regime.",
      "Treating output as a trust boundary is the unglamorous half of safety. The model is a generator, not an authority, COUTCHECK is the editor who reads every line before it's published.",
    ],
    chart: "write-trust",
  },
  {
    slug: "ceval-online-evals",
    title: "CEVAL: nine evaluators that grade your LLM output without a second LLM",
    date: "2026-06-18",
    tag: TAG,
    summary:
      "LLM-as-judge is expensive and leaks your data. CEVAL ships nine deterministic evaluators, toxicity, PII, injection-safety, relevance, JSON validity and more, that score input/output pairs locally and track the results over time.",
    paras: [
      "The default way to evaluate LLM output in production is to call another LLM to grade it. That's a second bill, a second source of latency, and a second copy of your users' data leaving the building. CEVAL takes the other road: nine deterministic evaluators that score an input/output pair in-process, no model, no egress.",
      "The roster covers the checks teams actually run: non_empty, json_valid, toxicity, pii_leak, injection_safe, answered, exact_match, contains, and relevance. Call one by name, or run CEVAL SUITE to fire all of them, and each returns a name, a score, a pass/fail, and a detail string you can log or alert on.",
      "Because they're deterministic, the results are trackable rather than noisy: CEVAL's per-evaluator counters surface on /metrics as crowkis_eval_* series, so you can watch your toxicity rate or JSON-validity rate as a time series on the same dashboard as your cache hits, and catch a regression the day a prompt change ships, not the week the complaints arrive.",
      "An eval you can afford to run on every request is worth more than a perfect one you run on a sample. CEVAL is cheap enough to be always-on, which is the only way evals catch the regression that happens at 2 a.m.",
    ],
    plain:
      "Instead of paying a second AI to grade the first one's answers, Crowkis runs fast local checks, for toxicity, leaked personal data, valid JSON, relevance, and charts the pass rates over time.",
    chart: "read-path",
  },
  {
    slug: "cprompt-versioning-and-ab",
    title: "CPROMPT: version your prompts and A/B test them like code",
    date: "2026-06-15",
    tag: TAG,
    summary:
      "Prompts are production logic edited like sticky notes. CPROMPT gives them named templates, automatic versioning, rollback, variable rendering, and sticky weighted A/B splits, all surviving restart.",
    paras: [
      "Prompts are some of the most load-bearing strings in a modern app, and most teams manage them worse than they manage CSS: pasted into code, edited live, with no history of what changed or what it did to quality. CPROMPT treats a prompt like the production artifact it is, a named template that versions automatically on every write.",
      "The verbs read like a tiny VCS: SET creates a new version, GET fetches one, VERSIONS lists the history, ROLLBACK reverts to a known-good one, and RENDER substitutes {{variables}} into the template at call time. Nothing is lost; the prompt you shipped last Tuesday is still retrievable after the prompt you shipped today turned out worse.",
      "The A/B layer is where it earns its place in the request path: ABSET defines a weighted split across versions, and AB with a SUBJECT id assigns each user stickily, the same subject always lands in the same bucket, via a hash over cumulative weights, so your experiment is consistent per user instead of flickering per request. The whole thing persists across restarts, so an experiment doesn't reset when a pod reschedules.",
      "Prompt changes are deploys. CPROMPT gives them the version history, the rollback button, and the experiment framework that every other kind of deploy already takes for granted.",
    ],
    plain:
      "Crowkis stores your prompts like versioned code, with history, rollback, variable filling, and per-user A/B tests that stick to the same user every time.",
    chart: "drop-in",
  },
  {
    slug: "cdoc-self-hosted-rag",
    title: "CDOC: a self-hosted RAG store that chunks, filters, and reranks",
    date: "2026-06-13",
    tag: TAG,
    summary:
      "You don't always need a separate vector database to do retrieval. CDOC is a mini RAG store inside Crowkis, auto-chunking, metadata filtering, and optional cross-encoder reranking, sharing the cache's embedder.",
    paras: [
      "Retrieval-augmented generation usually means standing up a whole second system: a vector database, an embedding pipeline, a chunker, a reranker. For a working set that fits a cache, that's a lot of moving parts. CDOC folds the common case into Crowkis itself, a self-hosted mini vector store that speaks the same RESP you already use.",
      "CDOC ADD takes an id and text and, with CHUNK and OVERLAP, splits a long document into overlapping passages automatically, attaching whatever META key=value pairs you pass. CDOC SEARCH runs an approximate-nearest-neighbour query with field-level FILTER predicates and an optional RERANK pass, returning [id, text, score] triples, the shape every RAG pipeline expects.",
      "The quiet win is that CDOC shares the cache's bundled ONNX embedder and, for reranking, its cross-encoder, the same models proven on the memory benchmarks. So retrieval inherits the same zero-egress property: your documents are embedded and searched locally, which matters when 'the documents' are contracts, tickets, or anything you can't ship to a hosted API.",
      "CDOC isn't trying to be Pinecone. It's trying to delete Pinecone from the architecture diagram for the many apps whose corpus is small enough to live beside the cache, and for those apps, one fewer system is the whole feature.",
    ],
    chart: "read-path",
  },
  {
    slug: "csession-multi-turn-memory",
    title: "CSESSION: conversation buffers with semantic recall built in",
    date: "2026-06-11",
    tag: TAG,
    summary:
      "Chat history is more than the last N turns. CSESSION stores a multi-turn buffer per session, bounded and TTL'd, with both recent-window reads and semantic search across the whole conversation.",
    paras: [
      "Every chat app reinvents the same buffer: a list of turns, trimmed to fit the context window, stuffed back into the next prompt. CSESSION makes it a first-class object. CSESSION ADD appends a turn with its role and an optional TTL; the buffer is bounded per session so a long conversation can't grow without limit.",
      "Reading it works two ways, because conversations are queried two ways. CSESSION RECENT pulls the last N turns for the familiar sliding-window prompt. CSESSION SEARCH runs a semantic query across the entire conversation, so 'what did they say about their budget earlier?' finds the turn from forty messages ago that a recent-window read would have dropped.",
      "That second mode is the one that changes what your agent can do. The sliding window forgets the start of a long conversation; semantic recall over the full buffer doesn't, which means an assistant can answer 'as I mentioned earlier' correctly instead of pretending the earlier part never happened.",
      "It's the buffer you were going to build anyway, with the semantic search you probably weren't, bounded, expiring, and one command away instead of one service away.",
    ],
    plain:
      "Crowkis keeps a conversation's history for you and lets you both grab the last few messages and semantically search the whole thing, so the agent can recall something said long before the context window's edge.",
    chart: "agent-fanout",
  },
  {
    slug: "cpin-golden-answers",
    title: "CPIN: golden answers that are served verbatim, with an audit trail",
    date: "2026-06-09",
    tag: TAG,
    summary:
      "For the questions where 'close enough' is unacceptable, pricing, legal, brand lines, CPIN serves a human-approved answer verbatim, records who approved it, and never lets the model improvise.",
    paras: [
      "Some answers cannot be paraphrased. The exact refund policy, the regulated disclosure, the brand's one approved description of itself, for these, a semantic cache's 'similar enough' is exactly the wrong instinct, and a freshly generated answer is a liability. CPIN carves out a verbatim lane: a human-approved answer that's served word-for-word when a query matches.",
      "The mechanics are deliberately strict. CPIN stores the approved answer with a BY field naming who pinned it; CPINGET checks whether an incoming query matches a pinned answer and returns it with that attribution; CPINLIST gives an auditable inventory; CUNPIN removes one. The match still uses semantics so paraphrases of the question hit the pin, but the answer never varies.",
      "Pinning sits ahead of generation in priority, which is the point: a pinned question never reaches the model, so there's no chance of an improvised legal answer or an off-brand description slipping out. The audit trail means that when compliance asks 'who approved this language and when,' the answer is a query, not an investigation.",
      "It's the feature that lets a probabilistic system make deterministic promises about the answers that matter most. The model handles the long tail; CPIN handles the sentences a lawyer wrote.",
    ],
    plain:
      "For answers that must be exact, pricing, legal, brand lines, Crowkis serves a human-approved version word-for-word and logs who approved it, so the AI never improvises on the sentences that matter.",
    chart: "write-trust",
  },
  {
    slug: "cflag-negative-cache",
    title: "CFLAG and CCHECKBAD: a memory for the answers that were wrong",
    date: "2026-06-07",
    tag: TAG,
    summary:
      "Most caches only remember good answers. Crowkis also remembers bad ones, flag a hallucinated or harmful response once, and CCHECKBAD catches every paraphrase of the question that would have reproduced it.",
    paras: [
      "A cache that only stores good answers has half a memory. When a model hallucinates a wrong answer, a made-up API, a fabricated policy, a confidently incorrect fact, you fix it once and then wait for it to happen again to the next user who phrases the question slightly differently. CFLAG closes that loop by recording the bad answer in a negative cache, with an optional reason.",
      "CCHECKBAD is the read side: it asks whether an incoming query matches a flagged-bad entry, and if so returns the matched question and the reason it was flagged. Because the match is semantic, flagging one phrasing of the bad question inoculates against all of them, the paraphrase that would have regenerated the hallucination is caught too.",
      "This turns human review into durable protection. A support lead who spots a wrong answer flags it; from that moment, every semantically similar question is intercepted before it can reproduce the error, with the reason attached so the next reviewer understands the history. The negative cache is tenant-scoped, so one team's correction doesn't leak into another's traffic.",
      "Knowing what's true is half of intelligence; remembering what was false is the other half. CFLAG gives the cache an immune memory, the answers it has learned to refuse.",
    ],
    plain:
      "Flag a wrong or harmful answer once, and Crowkis blocks every reworded version of that question from producing it again, with the reason attached for the next reviewer.",
    chart: "write-trust",
  },
  {
    slug: "csource-answer-lineage",
    title: "CSOURCE: answer lineage and cascade-purge when the source changes",
    date: "2026-06-05",
    tag: TAG,
    summary:
      "Cached answers derive from sources, a doc, a config, an API. CSOURCE ties answers to their origin so that when the source changes, every answer built on it can be purged in one move.",
    paras: [
      "Cached answers don't appear from nowhere; they're derived from a source, a knowledge-base article, a pricing config, an upstream API response. When that source changes, every answer built on it is silently stale, and a cache with no concept of lineage has no way to find them. CSOURCE adds that concept.",
      "CSOURCE LINK ties a cache entry to a source id; CSOURCE LIST shows what derives from a given source; CSOURCE PURGE invalidates everything linked to a source in one cascade. So when the pricing doc revs or the upstream API changes its answer, you don't hunt for affected entries, you purge by source and the derived answers go with it.",
      "This is the difference between freshness you hope for and freshness you can prove. Time-based TTLs guess at how long an answer stays true; source lineage knows the exact moment it stopped, because it's wired to the thing that changed. The two compose, TTLs for the unknowable, lineage for the knowable.",
      "An answer that can't name its source can't be invalidated when the source moves. CSOURCE makes the cache's contents accountable to where they came from, which is what 'trustworthy cache' actually means when the underlying truth is a moving target.",
    ],
    plain:
      "Crowkis remembers which source each cached answer came from. Change the source, a doc, a config, and one command purges every answer built on it, instead of hoping a timer expires them.",
    chart: "write-trust",
  },
  {
    slug: "ctoolset-tool-result-cache",
    title: "CTOOLSET: cache the tool call so the agent stops paying for it twice",
    date: "2026-06-03",
    tag: TAG,
    summary:
      "Agents call the same tools with the same arguments constantly. CTOOLSET and CTOOLGET cache tool results keyed by tool plus exact arguments, so a deterministic call runs once and serves many.",
    paras: [
      "Agentic workflows are full of repeated tool calls: five agents in a fan-out all look up the same schema, the same weather, the same exchange rate, each one a round trip and sometimes a metered API hit. For deterministic tools, same arguments, same result, that repetition is pure waste. CTOOLSET caches the result keyed by the tool name plus its exact arguments.",
      "CTOOLGET checks that cache before the agent makes the call: a hit returns the prior result instantly; a miss runs the tool and CTOOLSET banks it for the next caller. Because the key is the tool and its exact args, there's no fuzzy-match risk, 'weather in Berlin' and 'weather in Munich' are different keys, served correctly.",
      "The payoff scales with fan-out. A single agent rarely calls the same tool with the same args twice in a row, but a swarm of agents working a shared problem does it constantly, and a multi-step plan that revisits the same lookup across iterations does too. Caching the tool layer turns N identical calls into one.",
      "Semantic caching saves you from re-asking the model; tool caching saves you from re-calling the world. Together they mean an agent system's repeated work, model and tools alike, gets done once.",
    ],
    plain:
      "When agents call the same tool with the same inputs, Crowkis returns the saved result instead of running it again, turning a swarm's duplicate lookups into a single call.",
    chart: "agent-fanout",
  },
  {
    slug: "cinvalidate-natural-language-purge",
    title: "CINVALIDATE: purge the cache by meaning, with a preview before you commit",
    date: "2026-06-01",
    tag: TAG,
    summary:
      "Sometimes you need to clear 'everything about the old pricing', a fuzzy, semantic set. CINVALIDATE takes a natural-language instruction, previews what it would purge, and only acts on COMMIT.",
    paras: [
      "Cache invalidation by exact key is easy and rarely what you want. The real need is fuzzy: 'clear everything about the discontinued product,' 'purge the answers that referenced the old policy.' That's a semantic set, not a key list, and CINVALIDATE addresses it directly, you describe what to remove in natural language and it finds the entries whose meaning matches.",
      "The safety design is the important part. CINVALIDATE previews by default: it shows you which entries the instruction would purge, scoped by TENANT, bounded by LIMIT, and tunable by THRESHOLD, without deleting anything. Only when you add COMMIT does it act. Destructive operations that match by meaning need a dry run, because 'matches the meaning of' is exactly the kind of predicate that's easy to get subtly wrong.",
      "That preview-then-commit rhythm turns a scary operation into a routine one. You can tighten the threshold until the preview shows exactly the set you intended, then commit with confidence, instead of firing a fuzzy delete and discovering the blast radius afterward.",
      "Invalidation is where caches earn distrust, because it's where a small mistake clears the wrong things. CINVALIDATE makes the mistake visible before it's permanent, which is the only responsible way to delete by meaning.",
    ],
    plain:
      "Tell Crowkis to clear 'everything about the old pricing' in plain language. It shows you exactly what would be deleted first, and only does it when you confirm.",
    chart: "write-trust",
  },
  {
    slug: "cstale-serve-while-revalidate",
    title: "CSTALE: serve the slightly-old answer now, refresh it behind the scenes",
    date: "2026-05-30",
    tag: TAG,
    summary:
      "A hard TTL turns a one-second-expired answer into a full model call. CSTALE serves the cached answer past its TTL with a stale flag, so you choose freshness versus latency per request.",
    paras: [
      "Hard expiry is a blunt instrument: the moment an entry's TTL passes, the next request eats a full model call, even if the answer is one second stale and perfectly usable. CSTALE adds the stale-while-revalidate pattern that CDNs have used for years, it returns the cached answer even past its TTL, marked with a stale flag so the caller knows.",
      "That flag is the control surface. For a dashboard number or a chat reply, a few-seconds-stale answer served instantly is the right call, and you ignore the flag. For a price or a balance, you treat the flag as a signal to kick off a refresh, serve the stale value for snappiness while the fresh one computes, or block for the fresh one when correctness outranks speed. The policy is yours, per request.",
      "The win is that expiry stops being a latency cliff. Instead of every TTL boundary becoming a synchronous model call for some unlucky user, the stale answer covers the gap while the cache refreshes, and the p99 that a hard TTL would spike stays flat.",
      "Freshness and latency are a dial, not a switch. CSTALE hands you the dial, most answers can tolerate a moment of staleness in exchange for never paying the cold-miss tax, and the ones that can't are exactly the ones the flag lets you treat differently.",
    ],
    plain:
      "Instead of a just-expired answer forcing a slow fresh call, Crowkis can hand back the slightly-old one instantly (flagged as stale) and refresh in the background, you decide which answers can tolerate that.",
    chart: "read-path",
  },
  {
    slug: "cbudget-spend-visibility",
    title: "CBUDGET: per-tenant spend you can see before the invoice does",
    date: "2026-05-28",
    tag: TAG,
    summary:
      "Token spend is usually a month-end surprise. CBUDGET tracks per-tenant token and dollar consumption in real time and surfaces alerts, so a runaway tenant is a notification, not a billing shock.",
    paras: [
      "LLM spend has a nasty shape: it's invisible until the invoice, and by then it's spent. CBUDGET makes it legible per tenant in real time, token counts and dollar estimates accumulated as traffic flows, queryable with CBUDGET GET, with CBUDGET ALERTS surfacing the tenants approaching or crossing their thresholds.",
      "Per-tenant is the granularity that matters, because spend problems are almost always local: one tenant's runaway loop, one customer's pathological workload, one integration gone wrong. A global number hides them; a per-tenant breakdown points straight at the cause while there's still time to act.",
      "It pairs naturally with the cache's whole reason for existing. Every hit Crowkis serves is spend that didn't happen, and CBUDGET shows the spend that did, so you see both the bill and the savings against it, per tenant, on the same dashboard. The cache's value stops being a claim and becomes a number you can point at.",
      "You can't manage what you can't see, and you definitely can't manage it a month late. CBUDGET moves spend from the post-mortem to the present tense, where it's still a decision instead of a regret.",
    ],
    plain:
      "Crowkis tracks how much each tenant is spending on tokens as it happens and alerts you when one runs hot, so a runaway cost is a notification today, not a shock on next month's bill.",
    chart: "budget-wall",
  },
  {
    slug: "ai-gateway-openai-compatible",
    title: "The AI Gateway: a semantic cache in front of any OpenAI-compatible API",
    date: "2026-05-25",
    tag: TAG,
    summary:
      "Point your existing OpenAI client at Crowkis and change nothing else. The gateway proxies /v1/chat/completions, serves semantic hits without an upstream call, and adds retries, routing, and rate limits.",
    paras: [
      "The lowest-friction way to put a cache in front of your model is to not change your code at all. Crowkis's AI Gateway exposes an OpenAI-compatible POST /v1/chat/completions endpoint: point your existing client's base URL at Crowkis, and every request flows through a semantic cache on its way to the provider, no SDK swap, no rewrite.",
      "On a hit, the gateway answers from cache with no upstream call and no token cost, marking the response with an x-crowkis-cache: hit header so you can measure the savings. On a miss, it forwards to the upstream, caches the result, and returns it. Streaming requests are proxied transparently. The whole thing is off by default, it only activates with CROWKIS_GATEWAY=1 and an upstream configured, so zero-egress stays the default posture.",
      "Around the cache, the gateway adds the operational layer a raw provider call lacks: automatic retries with exponential backoff and jitter, weighted multi-provider routing with failover on error class, and per-key rate limits on the paid tier. The dashboard and /metrics expose requests, cache-hit rate, upstream calls, failovers, and 429s.",
      "It's the adoption path for teams that don't want to learn a cache API: keep your OpenAI client, change one URL, and get semantic caching, resilience, and spend visibility as a side effect of where the requests now go.",
    ],
    plain:
      "Aim your existing OpenAI client at Crowkis instead of OpenAI. Repeated questions get answered from cache with no provider call, and you get retries and routing for free, without changing your code.",
    chart: "drop-in",
  },
  {
    slug: "cembed-free-local-embeddings",
    title: "CEMBED: free local embeddings, cached, with no API key",
    date: "2026-05-23",
    tag: TAG,
    summary:
      "Embeddings usually mean an API key and a per-token bill. CEMBED turns text into vectors using the bundled ONNX model, locally, for free, and caches repeats so the second call is instant.",
    paras: [
      "Embedding text is table-stakes infrastructure that quietly costs money and leaks data: most teams call a hosted embeddings API, paying per token and shipping their text to a third party. CEMBED removes both costs, it embeds text with the bundled all-MiniLM-L6-v2 ONNX model, in-process, with no API key and no egress.",
      "It also remembers. Repeated text, and production traffic is full of repeats, is served from an embedding micro-cache, so the second CEMBED of the same string is effectively free and instant. That's the same micro-cache that turns exact-repeat semantic lookups from milliseconds into microseconds, exposed as a primitive you can call directly.",
      "Having a free local embedder as a command, not just an internal detail, is more useful than it sounds. It means the embedding behind your retrieval, your clustering, your dedup, or your own semantic feature comes from the same model the cache uses, consistent vectors, one dependency, no bill, and you can build on it without standing up an embedding service.",
      "The cheapest embedding is the one you already computed; the second cheapest is the one that never left your machine. CEMBED is both, which is why it's the quiet foundation the rest of the intelligence layer stands on.",
    ],
    plain:
      "Turn text into vectors locally with no API key and no bill, using the model Crowkis already bundles, and repeated text is embedded once and reused, so it's instant the second time.",
    chart: "read-path",
  },
  {
    slug: "multimodal-image-text-cache",
    title: "Caching what the model saw: multimodal image-plus-text lookups",
    date: "2026-05-20",
    tag: TAG,
    summary:
      "Vision queries are expensive and repetitive, the same product photo, the same screenshot, asked about again and again. Crowkis caches image-plus-text lookups so a repeated visual question is a hit.",
    paras: [
      "Multimodal calls are among the priciest a model offers, and in production they repeat constantly: the same product image run through 'describe this,' the same screenshot asked 'what's the error,' the same chart queried 'summarize this.' A text-only cache can't see the image, so it misses every time. Crowkis caches the image-plus-text pair, so the second identical visual question is a hit.",
      "CSET accepts an IMAGE argument alongside the query, and CGET (and CIMGGET) match on the combination, the image's content and the accompanying text together. So 'what's in this photo' over an identical image returns the cached answer instead of re-running an expensive vision pass, while a different image is correctly a different key.",
      "The economics are the same argument the whole product makes, sharpened by price: vision tokens cost more than text tokens, so the savings per avoided call are larger. Anywhere the same images recur, catalogues, dashboards, document pipelines, support screenshots, the multimodal cache turns a repeated expensive call into a cheap lookup.",
      "An LLM cache that goes blind the moment an image appears isn't a cache for how models are actually used now. Crowkis remembers what the model saw, not just what it was told, because the picture is increasingly part of the question.",
    ],
    plain:
      "When the same image and question come in again, Crowkis returns the saved answer instead of re-running an expensive vision call, it caches the picture, not just the words.",
    chart: "repeat-bill",
  },
  {
    slug: "confidence-scoring-per-hit",
    title: "Confidence scoring: every hit arrives with a number you can gate on",
    date: "2026-05-17",
    tag: TAG,
    summary:
      "A cache that only says 'hit' or 'miss' makes you trust it blindly. Crowkis returns a confidence score per hit, a geometric mean of five signals, so you decide the bar reuse must clear.",
    paras: [
      "Most caches answer a binary question: is it a hit? That forces blind trust, you take the cached answer or you don't, with no sense of how safe the reuse actually is. Crowkis answers a richer question, returning a confidence score with every hit so 'should I trust this?' has a number behind it.",
      "The score is a geometric mean of five signals, similarity, freshness, trust, validation, and domain-accuracy, and the geometric mean is the deliberate choice: it's unforgiving, because any single signal near zero drags the whole score down. A perfectly similar but stale answer, or a fresh but low-trust one, scores low, exactly as it should. One strong signal can't paper over a weak one.",
      "You consume it with WITHCONFIDENCE and gate on it per intent: serve factual hits above a high bar, route borderline ones to the model, refuse the rest. Because the threshold is per intent class and adapts over time, the bar a creative query must clear differs from a factual one's, confidence isn't one global knob, it's a per-question judgement you can tune.",
      "Reuse without a confidence number is faith. Crowkis replaces the faith with a measurement and hands you the dial, so the cache's aggression is your decision, made per hit, with the evidence attached.",
    ],
    plain:
      "Every cached answer comes with a score for how safe it is to reuse, built from five signals where any weak one tanks the total, so you set the bar and the cache respects it.",
    chart: "read-path",
  },
  {
    slug: "adaptive-thresholds-that-learn",
    title: "Adaptive thresholds: the cache tunes its own reuse bar over time",
    date: "2026-05-14",
    tag: TAG,
    summary:
      "A fixed similarity threshold is wrong the day after you set it. Crowkis uses a three-tier scheme, per-intent base, complexity adjustment, and an EMA feedback loop, that learns the right bar and persists it.",
    paras: [
      "Pick a similarity threshold and you've made a guess that ages badly: too loose and the cache serves near-misses, too tight and it misses safe reuse, and the right value drifts as your traffic shifts. Crowkis doesn't ask you to pick one number; it runs a three-tier scheme that converges on the right bar and keeps it current.",
      "Tier one is a table of base thresholds, one per intent class, because a factual lookup and a creative request have different safe bars to begin with. Tier two adjusts for query complexity, nudging the bar up or down by up to 0.08 based on how hard the question is. Tier three is the learner: an exponential moving average over feedback, decaying old signal as new arrives, so the threshold tracks reality instead of a launch-day assumption.",
      "Crucially, what it learns persists. The tuned thresholds survive restarts, so the cache doesn't forget months of calibration because a pod rescheduled, it comes back as smart as it went down. The adaptation is per intent, so the system learns a different lesson for factual traffic than for personal traffic, which is the only granularity that makes the learning safe.",
      "A threshold you set once is a guess with a timestamp. A threshold that learns is a system that gets more correct the longer it runs, and persists what it learned, so the calibration compounds instead of resetting.",
    ],
    plain:
      "Instead of you guessing one 'how similar is similar enough' number, Crowkis starts with sensible per-question defaults and then learns the right bar from real traffic, and remembers it across restarts.",
    chart: "read-path",
  },
  {
    slug: "cdedup-semantic-deduplication",
    title: "CDEDUP: collapsing the answers that mean the same thing",
    date: "2026-05-11",
    tag: TAG,
    summary:
      "A semantic cache slowly accumulates near-duplicate answers. CDEDUP finds the clusters that mean the same thing and collapses them, reclaiming memory, and Crowkis is honest about its cost.",
    paras: [
      "Over time a semantic cache fills with near-duplicates: a dozen phrasings of the same question, each stored as its own entry pointing at substantially the same answer. That's memory spent storing the same knowledge many times. CDEDUP runs semantic deduplication, it finds the clusters of entries that mean the same thing and collapses them, reporting the clusters found and the memory reclaimed.",
      "The mechanism reuses the cache's own intelligence: the embeddings already exist, so dedup is a clustering pass over vectors it has, not a fresh round of embedding. The bounded, batched path caps how much one run processes, so a maintenance pass doesn't try to fold the entire store in a single breath.",
      "We're also honest about where this is today: on a loaded instance, a dedup pass is heavy, and because it runs on the single-writer actor it can block live traffic while it works. The guidance is straightforward, treat CDEDUP as scheduled, off-peak maintenance rather than a hot-loop operation, and let the bounded path keep each run's footprint in check.",
      "Dedup is housekeeping, and good housekeeping is scheduled, not constant. CDEDUP reclaims the memory that semantic variety quietly consumes, run it on a cron, off-peak, and the cache stays lean without standing in front of your users.",
    ],
    plain:
      "A semantic cache piles up many rewordings of the same answer. CDEDUP merges the duplicates to free memory, best run as off-peak maintenance, since a big pass is heavy.",
    chart: "budget-wall",
  },
  {
    slug: "cpii-scrub-and-erase",
    title: "CPII: scrubbing personal data and honouring the right to be forgotten",
    date: "2026-05-08",
    tag: TAG,
    summary:
      "A cache of LLM traffic is a cache of whatever users typed, including PII. CPII reports what personal data is present and executes right-to-erasure, so compliance is a command, not a project.",
    paras: [
      "Any cache sitting in front of an LLM accumulates whatever users typed, and users type personal data, names, emails, account numbers, the contents of support tickets. That makes the cache a system of record for PII whether you intended it to be one or not, with all the obligations that follow. CPII is the tooling that makes those obligations executable.",
      "CPII REPORT surfaces what personal data is present, turning 'do we have PII in the cache?' from an audit into a query. CPII ERASE executes right-to-erasure, when a user invokes their right to be forgotten, you can actually carry it out across the cache instead of hoping TTLs eventually cover it. Erasure that you can prove is the difference between a compliance posture and a compliance hope.",
      "It composes with the privacy defaults that ship turned on: query previews are kept out of logs unless you opt in, structured logs can omit prompts, and retention windows bound how long anything lingers. CPII is the active layer on top of those passive defaults, not just 'we don't log much,' but 'we can find and remove exactly this person's data on request.'",
      "Privacy regulation treats a cache like any other store of personal data, and rightly so. CPII gives a team the two verbs that regime actually requires, show me what's here, and remove this person, as commands, so compliance is something you run, not something you schedule a quarter for.",
    ],
    plain:
      "Because the cache holds whatever users typed, it can hold personal data. CPII reports what's there and erases a specific person's data on request, making 'right to be forgotten' a single command.",
    chart: "write-trust",
  },
  {
    slug: "cinfo-and-the-dashboard",
    title: "CINFO and the dashboard: a cache you can actually watch work",
    date: "2026-05-05",
    tag: TAG,
    summary:
      "Infrastructure you can't observe is infrastructure you don't trust. CINFO and the built-in dashboard expose hit rate, saved spend, safety blocks, memory pressure, and license state in real time.",
    paras: [
      "The first question every operator asks a new piece of infrastructure is 'what is it actually doing right now?', and the worst answer is 'trust us.' Crowkis answers with surfaces instead: CINFO returns a Crowkis-flavoured INFO with server, cache, savings, security, db, and license sections, and the built-in dashboard renders the same truth live.",
      "What you watch is the stuff that matters operationally: the live hit rate and the breakdown of hit types, the dollars saved against the dollars spent, the safety blocks by pipeline stage, memory and block-cache pressure against their limits, and, because it gates features, the license plan, fingerprint, and days remaining. Agent-memory and AI-gateway metrics join the same view.",
      "It's all exposed three ways for the three audiences: the embedded dashboard for a human glancing at it, /api/metrics as JSON for your own tooling, and /metrics in Prometheus format for the monitoring stack you already run. The same numbers, shaped for whoever's asking, no separate agent to install, because it ships in the binary.",
      "Observability that comes free in the box, rather than as a bolt-on you assemble, is what lets a cache earn the critical path. You don't trust Crowkis because the README says to; you trust it because you can watch it save you money and block the bad writes, in real time, on a dashboard that was already running.",
    ],
    plain:
      "Crowkis ships with a live dashboard and an INFO command showing hit rate, money saved, safety blocks, and memory use, plus Prometheus metrics, so you can watch it work instead of taking it on faith.",
    chart: "read-path",
  },
  {
    slug: "ckeylimit-rate-limits",
    title: "CKEYLIMIT: per-tenant rate limits that stop the runaway before it starts",
    date: "2026-05-02",
    tag: TAG,
    summary:
      "A runaway agent or a noisy tenant can torch a budget in minutes. CKEYLIMIT sets per-tenant requests-per-minute and tokens-per-minute ceilings, enforced locally before the spend happens.",
    paras: [
      "Budget tracking tells you about overspend; rate limiting prevents it. A looping agent or a misbehaving integration can burn a month's budget in an afternoon, and a ceiling discovered on the invoice is a ceiling that did nothing. CKEYLIMIT sets the wall in advance, per-tenant requests-per-minute and tokens-per-minute limits, and enforces it locally, before the request reaches the provider.",
      "The granularity is per tenant for the same reason spend is tracked per tenant: abuse is local. One customer's runaway shouldn't be allowed to starve everyone else or torch the shared budget, and a per-tenant ceiling contains the blast radius to the tenant causing it. CKEYLIMIT SET configures the limits; GET reads them; DEL removes them.",
      "Because the wall is enforced at the cache, in front of the upstream, the runaway hits the limit at microsecond cost instead of metered cost, the blocked request never becomes a billed token. Pair it with CBUDGET's visibility and you have both halves: see the spend as it happens, and cap the source before it spends more.",
      "A budget without enforcement is a wish. CKEYLIMIT is the enforcement, the wall that's hit before the invoice is written, not discovered after.",
    ],
    plain:
      "Set a per-tenant cap on requests and tokens per minute, and Crowkis blocks a runaway tenant at the cache, so the overspend is stopped before it becomes billed tokens, not found on the bill.",
    chart: "budget-wall",
  },
  {
    slug: "cthink-creuse-reasoning-store",
    title: "CTHINK and CREUSE: banking a chain of thought and replaying it",
    date: "2026-04-29",
    tag: TAG,
    summary:
      "The reasoning is the expensive part of a hard answer. CTHINK stores a chain-of-thought trace as a reusable step graph; CREUSE fetches the matching plan for a new query at a fraction of the original token cost.",
    paras: [
      "On a genuinely hard query, the tokens go into the thinking, the step-by-step derivation, the plan, the structured analysis, far more than into the final sentence. Response caching can't touch that cost, because two questions with different specifics produce different final answers even when the reasoning is identical. CTHINK and CREUSE cache the reasoning itself.",
      "CTHINK takes a chain-of-thought trace and stores it as a step DAG, the typed sequence of reasoning steps with the specifics abstracted into slots. CREUSE takes a new query, matches its structure against stored skeletons, and returns the reasoning plan that fits, ready for the new specifics to be substituted in. The reuse runs at roughly fifteen percent of the original token cost, because you're recomposing a proven structure, not re-deriving it.",
      "The worked-example intuition makes it land: the way you solve one amortization problem is the way you solve all of them; the troubleshooting tree for one error class fits the next instance with new values. First solve pays full reasoning tokens; every structural sibling after pays a recomposition. It's gated by the same confidence machinery as everything else, so a skeleton only serves where the match clears the bar.",
      "No competitor caches the thinking, they cache the conclusion. Reusing reasoning is the deepest saving in the product precisely because it lives in the step between question and answer, where the tokens actually pile up.",
    ],
    plain:
      "The pricey part of a hard answer is the reasoning. Crowkis stores the reasoning's shape and replays it for the next question that needs the same thinking with different numbers, at a fraction of the cost.",
    chart: "read-path",
  },
];
