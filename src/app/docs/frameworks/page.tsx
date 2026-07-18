import { Metadata } from "next";
import { DocTitle, DocH2, DocP, DocCode, DocNote, DocPager } from "@/components/layout/docs-shell";

export const metadata: Metadata = {
  title: "LangChain, LangGraph, LlamaIndex & CrewAI",
  description:
    "Drop Crowkis into any agent framework, LangChain, LangGraph, LlamaIndex, CrewAI, for semantic caching and durable agent memory. Model-agnostic, no rewrite. Copy-paste guides for each.",
  keywords: [
    "Crowkis LangChain",
    "LangGraph agent memory",
    "LlamaIndex cache",
    "CrewAI memory",
    "LLM semantic cache",
    "agent memory",
  ],
};

export default function FrameworksPage() {
  return (
    <article>
      <DocTitle
        eyebrow="SDKs & integrations"
        title="LangChain, LangGraph, LlamaIndex & CrewAI"
        lead="Crowkis is model-agnostic and framework-agnostic. Two primitives cover every framework: a semantic cache that wraps any model call, and durable agent memory. Here's the exact drop-in for each."
      />

      <DocP>
        You don&apos;t restructure your code to adopt Crowkis. Whatever framework you use, the same two
        ideas apply: <strong>cache any model call</strong> so repeated and reworded questions are free,
        and <strong>give the agent memory</strong> that survives across sessions. The snippets below are
        copy-paste ready.
      </DocP>

      {/* ── LangChain ────────────────────────────────────────────────── */}
      <DocH2 id="langchain">LangChain</DocH2>
      <DocP>
        <strong>What:</strong> a semantic LLM cache. <strong>Why:</strong> LangChain&apos;s built-in
        cache is exact-match, so a reworded prompt misses and you pay again. <strong>How:</strong> set
        Crowkis as the cache once, it mirrors LangChain&apos;s own{" "}
        <code className="inline">set_llm_cache</code> pattern, so every model call in your app is cached
        by meaning with no chain changes.
      </DocP>
      <DocCode
        title="python · langchain"
        code={`from langchain_core.globals import set_llm_cache
from crowkis.integrations.langchain import CrowkisCache

set_llm_cache(CrowkisCache(tenant="support", ttl=3600))

from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o-mini")
llm.invoke("What is your refund policy?")     # miss → cached
llm.invoke("How long do refunds take?")       # semantic HIT → no model call`}
      />

      {/* ── LangGraph ────────────────────────────────────────────────── */}
      <DocH2 id="langgraph">LangGraph</DocH2>
      <DocP>
        <strong>What:</strong> durable agent memory as a graph node, plus the same LLM cache.{" "}
        <strong>Why:</strong> graphs restart and fan out; without memory each run relearns the user and
        re-pays for context. <strong>How:</strong> recall before the model call, remember after. Memory
        is scoped to <code className="inline">(agent, user)</code> and survives restarts.
      </DocP>
      <DocCode
        title="python · langgraph"
        code={`from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from crowkis import CrowkisMemory

llm = ChatOpenAI(model="gpt-4o-mini")

class S(TypedDict):
    user_id: str
    question: str
    context: list
    answer: str

def recall(state: S):
    mem = CrowkisMemory(agent="support", user=state["user_id"])
    return {"context": mem.recall(state["question"], k=5)}

def respond(state: S):
    mem = CrowkisMemory(agent="support", user=state["user_id"])
    prompt = f"Known about this user: {state['context']}\\n\\nQ: {state['question']}"
    answer = llm.invoke(prompt).content
    mem.extract(f"{state['question']}\\n{answer}")   # bank durable facts
    return {"answer": answer}

g = StateGraph(S)
g.add_node("recall", recall); g.add_node("respond", respond)
g.set_entry_point("recall"); g.add_edge("recall", "respond"); g.add_edge("respond", END)
app = g.compile()
print(app.invoke({"user_id": "u_42", "question": "Where do I live again?"})["answer"])`}
      />
      <DocNote>
        Pair this with <code className="inline">set_llm_cache(CrowkisCache(...))</code> and the model
        calls inside your graph are cached too, memory and caching from one engine.
      </DocNote>

      {/* ── LlamaIndex ───────────────────────────────────────────────── */}
      <DocH2 id="llamaindex">LlamaIndex</DocH2>
      <DocP>
        <strong>What:</strong> cache your RAG answers. <strong>Why:</strong> every LlamaIndex query
        re-runs retrieval and stuffs pages of context into the prompt, repeated questions pay that big
        bill again. <strong>How:</strong> wrap the query with the model-agnostic{" "}
        <code className="inline">cache.cached()</code> decorator; a repeated-or-rephrased question skips
        retrieval and the model entirely.
      </DocP>
      <DocCode
        title="python · llamaindex"
        code={`from crowkis import Crowkis
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

cache = Crowkis(tenant="docs")
index = VectorStoreIndex.from_documents(SimpleDirectoryReader("./docs").load_data())
engine = index.as_query_engine()

@cache.cached(ttl=3600)
def answer(question: str) -> str:
    return str(engine.query(question))   # retrieval + model, only runs on a real miss

answer("What is the SLA for enterprise plans?")
answer("enterprise plan uptime guarantee?")   # semantic HIT → no retrieval, no model`}
      />

      {/* ── CrewAI ───────────────────────────────────────────────────── */}
      <DocH2 id="crewai">CrewAI</DocH2>
      <DocP>
        <strong>What:</strong> shared memory and a cache for a crew of agents. <strong>Why:</strong>{" "}
        multi-agent crews ask overlapping questions and forget everything between runs.{" "}
        <strong>How:</strong> give each agent a <code className="inline">CrowkisMemory</code> for durable
        context, and wrap its tools/LLM calls with <code className="inline">cache.cached()</code> so the
        crew&apos;s overlap costs one answer, not one per agent.
      </DocP>
      <DocCode
        title="python · crewai"
        code={`from crowkis import Crowkis, CrowkisMemory

cache = Crowkis(tenant="research-crew")

# durable, per-agent memory across runs
planner_mem = CrowkisMemory(agent="planner", user="project-x")
planner_mem.remember("Project X targets EU launch in Q3")
planner_mem.recall("when does Project X launch?")

# cache any tool / model call the crew makes, model-agnostic
@cache.cached(ttl=3600)
def web_summarize(prompt: str) -> str:
    return any_model_or_tool(prompt)   # first agent pays; the rest reuse for free`}
      />

      {/* ── Any framework ────────────────────────────────────────────── */}
      <DocH2 id="any">Any other framework</DocH2>
      <DocP>
        Because Crowkis caches by wrapping <em>your</em> call, it works with anything that produces text, AutoGen, Haystack, a raw provider SDK, or your own loop. If you can put it in a function, you
        can cache it.
      </DocP>
      <DocCode
        title="python · works anywhere"
        code={`from crowkis import Crowkis
cache = Crowkis(tenant="my-app")

@cache.cached(ttl=3600)
def answer(prompt: str) -> str:
    return whatever_model_you_use(prompt)   # OpenAI, Claude, Llama, a tool, anything`}
      />

      {/* ── Shell ────────────────────────────────────────────────────── */}
      <DocH2 id="shell">Shell &amp; debugging</DocH2>
      <DocP>Everything is reachable without code, the binary is the server, REPL, and debugger.</DocP>
      <DocCode
        title="shell"
        code={`crowkis server --port 6379 --data ./.crow    # start the engine
crowkis cli                                    # open the REPL

> CSET "how do refunds work?" "Refunds take 5-7 business days." EX 3600
OK
> CGET "what's the refund timeline?"           # a paraphrase → hit
"Refunds take 5-7 business days."

crowkis why "can I get my money back?"         # which gate vetoed, with scores
crowkis doctor                                  # config, ports, model, data dir`}
      />

      <DocPager
        prev={["Node.js / TypeScript SDK", "/docs/sdk-node"]}
        next={["MCP for AI apps", "/docs/mcp"]}
      />
    </article>
  );
}
