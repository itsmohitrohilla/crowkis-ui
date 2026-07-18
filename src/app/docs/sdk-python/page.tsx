import { Metadata } from "next";
import {
  DocTitle,
  DocH2,
  DocP,
  DocCode,
  DocNote,
  DocPager,
} from "@/components/layout/docs-shell";

export const metadata: Metadata = {
  title: "Python SDK",
  description:
    "The official Crowkis Python client. Model-agnostic: cache any LLM call, OpenAI, Anthropic, a local model, anything, and save the tokens. Full method reference, copy-paste ready.",
};

export default function PythonSdkPage() {
  return (
    <article>
      <DocTitle
        eyebrow="SDKs"
        title="Python SDK"
        lead="Cache any model. Crowkis is model-agnostic, you bring the call to OpenAI, Anthropic, Llama, or whatever comes next, and Crowkis serves the repeats for free. Drop it in without restructuring your code."
      />

      <DocH2 id="install">Install</DocH2>
      <DocP>One command. Zero dependencies, nothing else to set up.</DocP>
      <DocCode title="shell" code={`pip install crowkis`} />

      <DocH2 id="idea">The one idea</DocH2>
      <DocP>
        Crowkis doesn&apos;t care which model you call. You wrap the call you already make;
        Crowkis remembers the answer by <em>meaning</em>, so the next time someone asks the same
        thing in different words, it&apos;s served instantly and for free. Any model that produces
        text, you can cache.
      </DocP>

      <DocH2 id="connect">Connect</DocH2>
      <DocCode
        title="python"
        code={`from crowkis import Crowkis

cache = Crowkis(host="127.0.0.1", port=6379, tenant="my-app")
# use AsyncCrowkis(...) for asyncio apps`}
      />

      <DocH2 id="cached">Cache any model, the decorator</DocH2>
      <DocP>
        The simplest way in. Decorate any function whose first argument is the prompt. It works
        like <code className="inline">functools.lru_cache</code>, but it matches on meaning, so
        rephrased prompts hit too. The function inside can call <em>any</em> provider.
      </DocP>
      <DocCode
        title="python"
        code={`@cache.cached(ttl=3600)
def answer(prompt: str) -> str:
    # this body can call OpenAI, Anthropic, a local model, Crowkis doesn't care
    return my_model(prompt)

answer("How do refunds work?")        # miss → your model runs, result cached
answer("What's the refund process?")  # semantic HIT → no model call`}
      />

      <DocH2 id="ask">Cache any model, explicit form</DocH2>
      <DocP>
        Prefer a function call over a decorator? <code className="inline">ask</code> does the same
        thing inline: return the cached answer, or run your compute and cache it.
      </DocP>
      <DocCode
        title="python"
        code={`text = cache.ask(
    "How do refunds work?",
    compute=lambda prompt: my_model(prompt),   # any model
    ttl=3600,
)`}
      />

      <DocH2 id="lookup-store">Lookup &amp; store directly</DocH2>
      <DocP>Full control over what gets read and written:</DocP>
      <DocCode
        title="python"
        code={`hit = cache.lookup("what's the refund timeline?")   # semantic match
if hit:
    print(hit.text, hit.similarity, hit.confidence)
else:
    cache.store("what's the refund timeline?", "5-7 business days.", ttl=3600)`}
      />

      <DocH2 id="stream">Streaming</DocH2>
      <DocP>Serve a cached answer in chunks so a hit feels like live output:</DocP>
      <DocCode
        title="python"
        code={`from crowkis import AsyncCrowkis

async with AsyncCrowkis(port=6379, tenant="my-app") as cache:
    async for chunk in cache.stream("Explain vector caches", compute=my_stream, ttl=3600):
        print(chunk, end="")`}
      />

      <DocH2 id="langchain">LangChain &amp; LangGraph</DocH2>
      <DocP>
        Set it once and every LangChain (and LangGraph) model call is cached by meaning, no chain
        changes. This mirrors LangChain&apos;s own <code className="inline">set_llm_cache</code>{" "}
        pattern, so it&apos;s a true drop-in.
      </DocP>
      <DocCode
        title="python"
        code={`from langchain_core.globals import set_llm_cache
from crowkis.integrations.langchain import CrowkisCache

set_llm_cache(CrowkisCache(tenant="my-app", ttl=3600))
# every LLM / chat-model call in your app now checks Crowkis first`}
      />

      <DocH2 id="memory">Agent memory</DocH2>
      <DocP>
        Durable, semantic, per-user memory for agents, LangGraph, CrewAI, AutoGen, or your own
        loop. Every recall is scoped to its agent and user.
      </DocP>
      <DocCode
        title="python"
        code={`from crowkis import CrowkisMemory

mem = CrowkisMemory(agent="support-bot", user="alice")
mem.remember("Alice prefers email over phone")
mem.recall("how should I contact Alice?")   # semantic recall`}
      />

      <DocH2 id="discover">Discover every command</DocH2>
      <DocCode
        title="python"
        code={`import crowkis
crowkis.help()            # grouped cheat-sheet of every feature
crowkis.help("memory")    # filter by topic`}
      />

      <DocH2 id="reference">Method reference</DocH2>
      <DocP>
        The full surface, grouped by what it&apos;s for. The high-level methods above cover most
        apps; everything below is available on the <code className="inline">Crowkis</code> client
        (or its helpers) when you want direct control.
      </DocP>

      <DocCode
        title="caching, model-agnostic"
        code={`cache.cached(ttl=, threshold=)      # decorator: cache any function's model call
cache.ask(prompt, compute=)        # recall, else run compute() and cache it
cache.stream(prompt, compute=)     # same, streamed in chunks (async)
cache.lookup(prompt)               # → CacheHit(text, similarity, confidence) | None
cache.store(prompt, answer, ttl=)  # write an answer for a prompt
cache.similar(prompt, k=10)        # k most similar cached prompts   [csim]
cache.embed(text)                  # get the raw embedding vector    [cembed]
cache.flush()                      # clear this tenant's cache        [cflush]`}
      />

      <DocCode
        title="agent memory, CrowkisMemory(agent, user=)"
        code={`mem.remember(fact, ttl=)     # store a fact to recall later
mem.recall(query, k=5)       # semantically recall relevant facts
mem.extract(conversation)    # pull salient facts out of a transcript
mem.history(query, k=5)      # recall including superseded versions
mem.as_of(query, unix_ms)    # recall memory as it stood at a point in time
mem.forget(query=)           # forget matching facts
mem.link(subj, rel, obj)     # add a knowledge-graph edge
mem.graph(entity, depth=)    # walk the knowledge graph`}
      />

      <DocCode
        title="conversation sessions"
        code={`cache.csession_add(session, role, text)      # append a turn
cache.csession_recent(session, n=)           # the last n turns
cache.csession_search(session, query, k=)    # search within a session`}
      />

      <DocCode
        title="quality & safety"
        code={`cache.cpin(query, answer)        # pin a curated answer that always wins
cache.cpinget(query)             # fetch a pinned answer
cache.cunpin(query)              # remove a pin
cache.cflag(query, bad_answer)   # mark a bad answer so it stops being served
cache.ccheckbad(query)           # has this been flagged?
cache.cguard(text)               # input safety check
cache.coutcheck(text)            # output safety check`}
      />

      <DocCode
        title="cost, limits & compliance"
        code={`cache.cbudget_set(tenant, daily_usd=, monthly_usd=)   # spend budget the gateway enforces
cache.cbudget_get(tenant)                            # current spend vs budget
cache.cbudget_alerts()                               # budget alerts
cache.ckeylimit_set(tenant, rpm=, tpm=)              # per-tenant rate limits
cache.cpii_report(tenant)                            # PII exposure report
cache.cpii_erase(identifier)                         # right-to-erasure
cache.cdedup(tenant)                                 # duplicate report`}
      />

      <DocCode
        title="operations & persistence"
        code={`cache.cinfo(section=)      # server info / stats
cache.csave(dest)          # snapshot to disk
cache.cbgsave(dest)        # background snapshot
cache.creload()            # reload from the latest snapshot`}
      />

      <DocCode
        title="management API, CrowkisAdmin(base_url) over HTTP"
        code={`admin.get_stats()                          # cache stats & hit rate
admin.health()                             # health check
admin.register_webhook({...})              # source-linked invalidation
admin.invalidate_source(source_id)         # purge everything tagged to a source
admin.flush_tenant(tenant_id)              # wipe one tenant`}
      />

      <DocNote>
        Sensible <code className="inline">timeout</code>, <code className="inline">max_retries</code>, and backoff defaults ship out of the box, override them in the constructor when your
        latency budget is stricter. The embedding model lives server-side, so every client
        (including redis-py / ioredis) uses whatever model the server runs.
      </DocNote>

      <DocPager prev={["Security model", "/docs/security"]} next={["Node.js / TypeScript SDK", "/docs/sdk-node"]} />
    </article>
  );
}
