import { Metadata } from "next";
import {
  DocTitle,
  DocH2,
  DocP,
  DocCode,
  DocNote,
  DocTable,
  DocPager,
} from "@/components/layout/docs-shell";

export const metadata: Metadata = {
  title: "Commands",
  description:
    "Crowkis command reference: the semantic C* command family plus the standard Redis commands it supports over RESP3.",
};

function C({ children }: { children: string }) {
  return <code className="inline">{children}</code>;
}

export default function CommandsPage() {
  return (
    <article>
      <DocTitle
        eyebrow="Reference"
        title="Commands"
        lead="Crowkis is Redis-compatible on the wire: the standard commands behave the way you expect, and the C* family adds the semantic cache on top."
      />

      <DocH2 id="semantic">The semantic family</DocH2>
      <DocTable
        head={["Command", "What it does"]}
        rows={[
          [<C key="1">CSET</C>, "Store an answer with model, tenant, and TTL. The write passes intent classification, template extraction, and the anti-poisoning pipeline before it is accepted."],
          [<C key="2">CGET</C>, "Retrieve by meaning. Exact matches, paraphrases, and structural template matches all qualify, if the confidence score clears the intent's threshold."],
          [<C key="3">CGETSTREAM</C>, "Like CGET, but streams the cached answer in chunks, so cached responses feel like live model output."],
          [<C key="4">CIMGGET</C>, "Multimodal lookup for image + text queries."],
          [<C key="5">CSIM</C>, "Inspect the K nearest semantic neighbours of a query. Your debugging window into the vector index."],
          [<C key="6">CFLUSH</C>, "Flush semantic entries for a tenant."],
          [<C key="7">CDELETEENTRY</C>, "Delete a specific cached entry."],
          [<C key="8">CVECCOUNT</C>, "Count of vectors currently in the HNSW index."],
        ]}
      />

      <DocH2 id="anatomy">Anatomy of a CSET</DocH2>
      <DocCode
        title="crowkis cli"
        code={`CSET "What is your refund window?" \\
     "Refunds are issued within 5 business days of approval." \\
     EX 86400 \\
     MODEL gpt-4o \\
     TENANT support`}
      />
      <DocTable
        head={["Part", "Meaning"]}
        rows={[
          [<C key="q">query</C>, "The question, stored both as an embedding and as an abstracted structural template."],
          [<C key="a">answer</C>, "The response to cache."],
          [<C key="ex">EX seconds</C>, "TTL. Freshness policies can shorten effective reuse further."],
          [<C key="m">MODEL name</C>, "Which model produced this, used for migration and canary workflows."],
          [<C key="t">TENANT id</C>, "Isolation boundary. Entries never cross tenants."],
        ]}
      />

      <DocH2 id="redis">Standard Redis commands</DocH2>
      <DocP>Supported over RESP2/RESP3 (negotiated via <C>HELLO</C>):</DocP>
      <DocTable
        head={["Group", "Commands"]}
        rows={[
          ["Connection", "PING · ECHO · HELLO · AUTH · QUIT · RESET"],
          [
            "Key-value",
            "GET · SET · GETSET · DEL · EXISTS · TTL · KEYS · TYPE · STRLEN · GETDEL · GETEX · GETRANGE · SETRANGE · INCR · INCRBY · INCRBYFLOAT · APPEND · MGET · MSET · SCAN · DBSIZE · RENAME",
          ],
          ["Expiry", "EXPIRE · PEXPIRE · PERSIST · PTTL"],
          [
            "Server",
            "INFO · COMMAND · CONFIG · FLUSHDB · FLUSHALL · LASTSAVE · TIME · BGSAVE · BGREWRITEAOF · COMPACT · SWEEP · STATS",
          ],
        ]}
      />
      <DocNote>
        Frame limits are enforced at the protocol layer: 1024 arguments, 64 MB per bulk string,
        128 MB per frame. RESP and gRPC traffic require{" "}
        <C>CROWKIS_AUTH_TOKEN</C> when set, compared in constant time.
      </DocNote>

      <DocH2 id="grpc">gRPC surface</DocH2>
      <DocP>
        The gRPC API (h2c, RESP port + 2) exposes <C>Get</C>, <C>Set</C>, <C>GetStream</C>,{" "}
        <C>Stats</C>, and <C>Invalidate</C>, the same cache, for services that prefer protobuf
        contracts. The schema lives at <C>proto/crowkis.proto</C> in the repository.
      </DocP>

      <DocPager prev={["Docker deployment", "/docs/docker"]} next={["Configuration", "/docs/configuration"]} />
    </article>
  );
}
