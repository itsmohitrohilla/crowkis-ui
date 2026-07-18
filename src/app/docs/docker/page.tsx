import { Metadata } from "next";
import Link from "next/link";
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
  title: "Docker deployment",
  description:
    "Deploy Crowkis with Docker: pull, run, compose, health checks, auth verification, upgrades, and license mounting.",
};

export default function DocsDockerPage() {
  return (
    <article>
      <DocTitle
        eyebrow="Getting started"
        title="Docker deployment"
        lead="The production way to run Crowkis. One hardened image from Docker Hub or GHCR, a compose file you can paste, and an auth boundary you can prove in two curl commands."
      />

      <DocH2 id="pull">Pull and run</DocH2>
      <DocCode
        code={`docker pull crowkis/crowkis:latest

docker run -d --name crowkis \\
  -p 127.0.0.1:6379:6379 \\
  -p 127.0.0.1:6380:6380 \\
  -p 127.0.0.1:6381:6381 \\
  -v crowkis-data:/data \\
  -e CROWKIS_ADMIN_KEY=change-me-admin-key \\
  -e CROWKIS_AUTH_TOKEN=change-me-resp-grpc-token \\
  crowkis/crowkis:latest`}
      />
      <DocTable
        head={["Port", "Surface"]}
        rows={[
          ["127.0.0.1:6379", "RESP3, crowkis cli or any Redis client"],
          ["127.0.0.1:6380", "Dashboard, management REST API, /health"],
          ["127.0.0.1:6381", "gRPC h2c"],
        ]}
      />
      <DocP>
        Ports publish to localhost. If you bind to <code className="inline">0.0.0.0</code>, the
        management API and dashboard metrics require{" "}
        <code className="inline">CROWKIS_ADMIN_KEY</code> or an RBAC API key, enforced by the
        server, not left to convention.
      </DocP>

      <DocH2 id="compose">Compose, production shape</DocH2>
      <DocP>
        The recommended deployment is the hardened compose file on the{" "}
        <Link href="/docker" className="font-semibold text-crow underline underline-offset-2">
          Docker image page
        </Link>{" "}, read-only filesystem, dropped capabilities, non-root, pids limit, localhost ports. Copy
        it, set the two credentials, <code className="inline">docker compose up -d</code>.
      </DocP>

      <DocH2 id="health">Health and auth checks</DocH2>
      <DocCode
        code={`curl http://127.0.0.1:6380/health
# expect JSON with service status and "admin_auth": "enabled"`}
      />
      <DocP>Verify the auth boundary holds before you trust it:</DocP>
      <DocCode
        code={`# should be rejected when auth is enabled
curl -i http://127.0.0.1:6380/api/metrics

# authenticated read
curl -H "x-crowkis-admin-key: change-me-admin-key" \\
  http://127.0.0.1:6380/api/metrics`}
      />
      <DocNote>
        <code className="inline">CROWKIS_ALLOW_UNAUTHENTICATED_ADMIN=1</code> exists for local
        experiments only. Never set it where a non-loopback interface is exposed.
      </DocNote>

      <DocH2 id="license">Mounting a license</DocH2>
      <DocP>
        Without a license file Crowkis runs the free Community edition at full power. An
        Enterprise license is one read-only mount:
      </DocP>
      <DocCode
        code={`docker run -d --name crowkis \\
  -v /path/to/license.json:/etc/crowkis/license.json:ro \\
  ... crowkis/crowkis:latest`}
      />
      <DocP>
        The signature is verified offline (Ed25519) at boot and every six hours. Renewal is
        replacing the file, no downtime, picked up at the next check.
      </DocP>

      <DocH2 id="upgrade">Upgrades</DocH2>
      <DocCode
        code={`docker pull crowkis/crowkis:latest
docker compose up -d   # or docker restart after re-create`}
      />
      <DocP>
        That&apos;s the entire upgrade path: binary swap. The on-disk format is stable, no schema
        migrations, no export/import.
      </DocP>

      <DocH2 id="day2">Day-2 operations</DocH2>
      <DocCode
        code={`docker logs -f crowkis           # structured JSON, one line per event
docker compose down              # stop, keep data
docker compose down -v           # stop and remove the data volume
docker exec -it crowkis crowkis cli   # REPL into the running server`}
      />

      <DocPager prev={["Quickstart", "/docs/quickstart"]} next={["Commands", "/docs/commands"]} />
    </article>
  );
}
