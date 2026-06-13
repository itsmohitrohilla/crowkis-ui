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
  title: "Configuration",
  description:
    "Crowkis configuration reference: networking, auth, memory and capacity, logging, and license environment variables.",
};

function C({ children }: { children: string }) {
  return <code className="inline">{children}</code>;
}

export default function ConfigurationPage() {
  return (
    <article>
      <DocTitle
        eyebrow="Reference"
        title="Configuration"
        lead="Everything is configured through environment variables, so the same image behaves identically in compose, Kubernetes, or a bare systemd unit."
      />

      <DocH2 id="network">Networking</DocH2>
      <DocTable
        head={["Variable", "Default", "Notes"]}
        rows={[
          [<C key="1">CROWKIS_BIND_ADDR</C>, <C key="1d">127.0.0.1</C>, "Address Docker publishes ports on. Localhost by default, on purpose."],
          [<C key="2">CROWKIS_BIND_HOST</C>, <C key="2d">0.0.0.0</C>, "Bind address inside the container, so Docker port mapping works."],
          [<C key="3">CROWKIS_BIND_PORT</C>, <C key="3d">6383</C>, "RESP port. The dashboard runs on port + 1, gRPC on port + 2."],
          [<C key="4">CROWKIS_MAX_CONNECTIONS</C>, <C key="4d">10000</C>, "Concurrent connection ceiling."],
        ]}
      />

      <DocH2 id="auth">Authentication</DocH2>
      <DocTable
        head={["Variable", "Notes"]}
        rows={[
          [<C key="1">CROWKIS_AUTH_TOKEN</C>, "Bearer token for RESP and gRPC. Compared in constant time. Set it before exposing either port."],
          [<C key="2">CROWKIS_ADMIN_KEY</C>, "Key for the management API and dashboard metrics. Mandatory once you bind beyond loopback."],
          [<C key="3">CROWKIS_ALLOW_UNAUTHENTICATED_ADMIN</C>, "Local development escape hatch. Never set it on a shared or public host."],
        ]}
      />
      <DocNote>
        Public-bind hardening is enforced in the server: if Crowkis detects a non-loopback
        deployment, management and dashboard metrics require auth by default — misconfiguration
        fails closed, not open.
      </DocNote>

      <DocH2 id="memory">Memory and capacity</DocH2>
      <DocTable
        head={["Variable", "Default", "Notes"]}
        rows={[
          [<C key="1">CROWKIS_MEMORY_LIMIT</C>, <C key="1d">512m</C>, "Runtime memory ceiling for the cache process."],
          [<C key="2">CROWKIS_BLOCK_CACHE_BYTES</C>, <C key="2d">64m</C>, "Block cache for hot SSTable reads — your read-path accelerator."],
        ]}
      />
      <DocP>
        The storage engine itself manages a 64 MB memtable that flushes to SSTables, with L0→L1→L2
        compaction, bloom filters (~1% false positives), and LZ4 block compression. Durability
        comes from a write-ahead log with CRC32-checked records.
      </DocP>

      <DocH2 id="logging">Logging and privacy</DocH2>
      <DocTable
        head={["Variable", "Default", "Notes"]}
        rows={[
          [<C key="1">CROWKIS_LOG_QUERY_PREVIEWS</C>, <C key="1d">0</C>, "Prompt previews stay out of logs unless you explicitly opt in. Privacy is the default."],
        ]}
      />
      <DocP>Logs are structured JSON on stderr, with rotation configured in the default compose file.</DocP>

      <DocH2 id="license">License</DocH2>
      <DocCode
        title=".env"
        code={`CROWKIS_LICENSE_PATH=/etc/crowkis/license.json
CROWKIS_LICENSE_PLAN=Community
CROWKIS_LICENSE_CUSTOMER=Local workspace`}
      />
      <DocP>
        No license file means Community edition — the full engine with a soft 100K-entry cap and up
        to 3 tenants. A valid Ed25519-signed license unlocks Enterprise at boot; an invalid
        signature refuses to start; an expired license degrades gracefully through a 14-day grace
        period.
      </DocP>

      <DocPager prev={["Commands", "/docs/commands"]} next={["Security model", "/docs/security"]} />
    </article>
  );
}
