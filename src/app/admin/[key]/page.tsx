import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { CountUp } from "@/components/ui/count-up";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { adminKeyOk, hasSession } from "@/lib/admin-auth";
import { withDb } from "@/lib/db";
import { login, logout } from "./actions";

const TZ = "Asia/Kolkata";
// Same id as layout.tsx. Used only to switch Analytics off here, see the script in the page.
const GA_ID = "G-4DQX8X4HM0";

export const dynamic = "force-dynamic";

// No title on purpose: metadata also renders on the 404 a wrong key gets.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/* ── data ─────────────────────────────────────────────────────────────────── */

type Day = { day: string; views: number; demos: number; plays: number; copies: number };
type Ranked = { label: string; n: number };
type Message = {
  id: number;
  name: string | null;
  email: string | null;
  message: string;
  source: string;
  created_at: string;
};
type Rating = { id: number; stars: number; comment: string | null; created_at: string };
type Data = {
  days: Day[];
  pages: Ranked[];
  snippets: Ranked[];
  buttons: Ranked[];
  inbox: { total: number; contact: number };
  messages: Message[];
  stars: { stars: number; n: number }[];
  ratings: Rating[];
};

// ponytail: everything in one statement. A round-trip to the database costs about 0.4s,
// so seven separate queries made the page seconds slower. Split it up if it gets unwieldy.
const SQL = `
with ev as (
  -- the same 30 local days the daily series covers, today included
  select name, path, meta, (created_at at time zone $1::text)::date as day
    from events
   where created_at >= now() - interval '32 days'
     and (created_at at time zone $1::text)::date >= (now() at time zone $1::text)::date - 29
)
select
  (select json_agg(t) from (
     select to_char(d, 'YYYY-MM-DD') as day,
            (count(*) filter (where ev.name = 'page_view'))::int as views,
            (count(*) filter (where ev.name = 'demo_click'))::int as demos,
            (count(*) filter (where ev.name = 'arcade_play'))::int as plays,
            (count(*) filter (where ev.name = 'code_copy'))::int as copies
       from generate_series((now() at time zone $1::text)::date - 29,
                            (now() at time zone $1::text)::date, interval '1 day') as d
       left join ev on ev.day = d::date
      group by d order by d) t) as days,
  (select coalesce(json_agg(t), '[]') from (
     select coalesce(path, '(unknown)') as label, count(*)::int as n
       from ev where name = 'page_view' group by 1 order by n desc, 1 limit 10) t) as pages,
  (select coalesce(json_agg(t), '[]') from (
     select meta as label, count(*)::int as n
       from ev where name = 'code_copy' and meta is not null group by 1 order by n desc, 1 limit 8) t) as snippets,
  (select coalesce(json_agg(t), '[]') from (
     select coalesce(meta, '(unknown)') as label, count(*)::int as n
       from ev where name = 'demo_click' group by 1 order by n desc, 1 limit 12) t) as buttons,
  (select json_build_object('total', count(*)::int,
                            'contact', (count(*) filter (where source = 'contact'))::int)
     from feedback) as inbox,
  (select coalesce(json_agg(t), '[]') from (
     select id, name, email, message, source, created_at
       from feedback order by created_at desc limit 50) t) as messages,
  (select coalesce(json_agg(t), '[]') from (
     select stars, count(*)::int as n from ratings group by stars) t) as stars,
  (select coalesce(json_agg(t), '[]') from (
     select id, stars, comment, created_at
       from ratings order by created_at desc limit 20) t) as ratings`;

const load = () => withDb(async (q) => (await q<Data>(SQL, [TZ]))[0]);

/* ── formatting ───────────────────────────────────────────────────────────── */

const num = (n: number) => n.toLocaleString("en-US");
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });
const plural = (n: number, one: string, many: string) => `${num(n)} ${n === 1 ? one : many}`;
const whenFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: TZ,
  dateStyle: "medium",
  timeStyle: "short",
});
const when = (iso: string) => whenFormat.format(new Date(iso));
const loadedFmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});
// Day strings from SQL are already local calendar days, so format them as plain UTC dates.
const dayFmt = (opts: Intl.DateTimeFormatOptions) => {
  const f = new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", ...opts });
  return (day: string) => f.format(new Date(`${day}T00:00:00Z`));
};
const shortDay = dayFmt({ day: "numeric", month: "short" });
const longDay = dayFmt({ weekday: "short", day: "numeric", month: "short" });

// Axis top: a round number whose half is also a whole number.
function niceMax(n: number) {
  if (n <= 10) return Math.max(2, n + (n % 2));
  const p = 10 ** Math.floor(Math.log10(n));
  return [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10].map((m) => m * p).find((v) => v >= n) ?? n;
}

/* ── pieces ───────────────────────────────────────────────────────────────── */

function Panel({
  title,
  note,
  className = "",
  children,
}: {
  title: string;
  note?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`card-quiet min-w-0 p-5 sm:p-6 ${className}`}>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
        {note && <p className="text-xs text-ink-soft">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-ink-line px-4 py-8 text-center text-sm text-ink-soft">
      {children}
    </p>
  );
}

/** 30-day trend under a tile's number: a quiet line with today marked in the accent. */
function Spark({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  const x = (i: number) => (i / (data.length - 1)) * 100;
  const y = (n: number) => 22 - (n / max) * 20;
  return (
    <div className="relative mt-3 h-6" aria-hidden>
      <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <polyline
          points={data.map((n, i) => `${x(i)},${y(n)}`).join(" ")}
          fill="none"
          stroke="rgb(var(--c-ink-faint))"
          strokeWidth="1.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        className="absolute right-0 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-crow"
        style={{ top: `${(y(data[data.length - 1]) / 24) * 100}%` }}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  note,
  href,
  spark,
  className = "",
}: {
  label: string;
  value: ReactNode;
  note: string;
  href?: string;
  spark?: number[];
  className?: string;
}) {
  const body = (
    <>
      <p className="text-xs font-medium text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold leading-none tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-ink-soft">{note}</p>
      {spark ? <Spark data={spark} /> : null}
    </>
  );
  return href ? (
    <a href={href} className={`card-block block p-4 hover:-translate-y-1 focus-visible:-translate-y-1 ${className}`}>
      {body}
    </a>
  ) : (
    <div className={`card-block p-4 ${className}`}>{body}</div>
  );
}

/**
 * Single-series daily column chart, server-rendered with plain divs.
 * Ink columns, brand red for today only. Values live in the y-axis, the peak label,
 * the hover / keyboard-focus tooltip and the table below the charts.
 */
function ColumnChart({
  title,
  one,
  many,
  data,
  small = false,
}: {
  title: string;
  one: string;
  many: string;
  data: { day: string; n: number }[];
  small?: boolean;
}) {
  const total = data.reduce((sum, d) => sum + d.n, 0);
  const peak = data.reduce((a, b) => (b.n >= a.n ? b : a)); // latest day on a tie
  const top = niceMax(peak.n);
  const last = data.length - 1;
  const height = small ? "h-28" : "h-56";
  const summary =
    total === 0
      ? `No ${many} yet`
      : `Peak ${num(peak.n)} on ${shortDay(peak.day)} · ${num(total)} total`;

  return (
    <Panel title={title} note={summary}>
      <div role="group" aria-label={`${title}, last 30 days. ${summary}.`}>
        <div className="flex gap-2 pt-4">
          <div
            aria-hidden
            className={`relative w-7 shrink-0 font-mono text-[10px] text-ink-soft ${height}`}
          >
            {[top, top / 2, 0].map((v, i) => (
              <span
                key={v}
                className="absolute right-0 -translate-y-1/2 leading-none"
                style={{ top: `${i * 50}%` }}
              >
                {compact.format(v)}
              </span>
            ))}
          </div>
          <div className={`relative min-w-0 flex-1 ${height}`}>
            <div className="absolute inset-x-0 top-0 border-t border-ink-line" />
            <div className="absolute inset-x-0 top-1/2 border-t border-ink-line" />
            <div className="absolute inset-x-0 bottom-0 border-t border-ink-faint" />
            <div className="absolute inset-0 flex">
              {data.map((d, i) => {
                const pct = (d.n / top) * 100;
                return (
                  <div
                    key={d.day}
                    tabIndex={0}
                    role="img"
                    aria-label={`${longDay(d.day)}: ${plural(d.n, one, many)}`}
                    className="group relative flex h-full flex-1 items-end justify-center px-px outline-none hover:bg-ink/5 focus-visible:bg-ink/10 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ink"
                  >
                    {d.n > 0 && (
                      <div
                        className={`admin-rise w-full max-w-6 rounded-t ${i === last ? "bg-crow" : "bg-ink"}`}
                        style={{ height: `max(${pct}%, 3px)`, ["--i" as string]: i }}
                      />
                    )}
                    {d.n > 0 && d === peak && (
                      <span
                        aria-hidden
                        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-semibold leading-none text-ink"
                        style={{ bottom: `calc(${pct}% + 3px)` }}
                      >
                        {num(d.n)}
                      </span>
                    )}
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute z-10 hidden whitespace-nowrap rounded-md border-2 border-ink bg-paper px-2.5 py-1.5 text-left text-xs shadow-block-sm group-hover:block group-focus-visible:block ${
                        i < 10 ? "left-0" : i > last - 10 ? "right-0" : "left-1/2 -translate-x-1/2"
                      }`}
                      style={{ bottom: `min(calc(${pct}% + 8px), calc(100% - 3rem))` }}
                    >
                      <div className="font-semibold text-ink">{plural(d.n, one, many)}</div>
                      <div className="text-ink-soft">
                        {longDay(d.day)}
                        {i === last && " · today"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {total === 0 && (
              <p className="pointer-events-none absolute inset-0 grid place-items-center text-center text-sm text-ink-soft">
                <span className="bg-paper-card px-3 py-1">
                  No {many} recorded yet. Columns appear here as they come in.
                </span>
              </p>
            )}
          </div>
        </div>
        <div aria-hidden className="ml-9 mt-2 flex h-4 font-mono text-[10px] text-ink-soft">
          {data.map((d, i) => (
            <div key={d.day} className="relative flex-1">
              {(last - i) % 7 === 0 && (
                <span
                  className={`absolute whitespace-nowrap leading-none ${
                    i === last ? "right-0 font-semibold text-ink" : "left-1/2 -translate-x-1/2"
                  }`}
                >
                  {i === last ? "Today" : shortDay(d.day)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function RankList({ rows, mono, empty }: { rows: Ranked[]; mono?: boolean; empty: string }) {
  if (rows.length === 0) return <Empty>{empty}</Empty>;
  return (
    <ol className="divide-y divide-ink-line text-sm">
      {rows.map((r) => (
        <li key={r.label} className="flex items-center gap-4 py-2.5 first:pt-0 last:pb-0">
          <span
            title={r.label}
            className={`min-w-0 flex-1 truncate ${mono ? "font-mono text-[13px]" : "font-medium"}`}
          >
            {r.label}
          </span>
          <span className="font-semibold tabular-nums">{num(r.n)}</span>
        </li>
      ))}
    </ol>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span role="img" aria-label={`${n} out of 5 stars`} className="whitespace-nowrap text-base leading-none tracking-wider">
      <span className="text-ink">{"★".repeat(n)}</span>
      <span className="text-ink-line">{"★".repeat(5 - n)}</span>
    </span>
  );
}

const FIELD =
  "mt-1.5 w-full rounded-lg border-2 border-ink bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-crow focus:shadow-block-sm";

function SignIn({ adminKey, error }: { adminKey: string; error?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-deep px-5 py-10 text-ink paper-grid">
      <script dangerouslySetInnerHTML={{ __html: `window["ga-disable-${GA_ID}"]=true` }} />
      <form action={login.bind(null, adminKey)} className="card-block w-full max-w-sm p-7 sm:p-8">
        <Image src="/logo.svg" alt="Crowkis" width={49} height={35} priority className="h-9 w-auto" />
        <p className="eyebrow mt-5">Admin</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">Sign in</h1>
        <label className="mt-6 block">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">Username</span>
          <input name="username" type="text" required autoComplete="username" autoCapitalize="none" spellCheck={false} className={FIELD} />
        </label>
        <label className="mt-4 block">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">Password</span>
          <input name="password" type="password" required autoComplete="current-password" className={FIELD} />
        </label>
        {error ? (
          <p className="mt-4 text-sm font-semibold text-crow" role="alert">
            {error === "locked"
              ? "Too many attempts. Try again in 10 minutes."
              : "Wrong username or password."}
          </p>
        ) : null}
        <button type="submit" className="btn-primary mt-6 w-full !py-3">
          Sign in
        </button>
      </form>
    </main>
  );
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { key } = await params;
  if (!adminKeyOk(key)) notFound(); // before any database access
  const query = await searchParams;
  if (!(await hasSession())) return <SignIn adminKey={key} error={query.error} />;
  let data: Data | null = null;
  try {
    data = await load();
  } catch (err) {
    console.error("admin dashboard: database query failed:", err instanceof Error ? err.message : err);
  }

  const footer = (
    <>
      <ThemeToggle />
      <Link
        href="/"
        className="rounded-lg border-2 border-roost-line px-3 py-1.5 text-center text-sm font-semibold text-stone-200 transition hover:border-stone-400"
      >
        Back to site
      </Link>
      <form action={logout.bind(null, key)}>
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-1.5 text-sm font-semibold text-stone-400 transition hover:text-stone-100"
        >
          Sign out
        </button>
      </form>
    </>
  );
  const note = `Last 30 days · loaded ${loadedFmt.format(new Date())}`;
  // The address of this page is a secret, so keep Google Analytics from recording it.
  const gaOff = <script dangerouslySetInnerHTML={{ __html: `window["ga-disable-${GA_ID}"]=true` }} />;

  if (!data) {
    return (
      <>
        {gaOff}
        <AdminShell
          views={[{ id: "overview", label: "Overview" }]}
          note={note}
          footer={footer}
          sections={{
            overview: (
              <div className="card-block p-6 sm:p-8" role="alert">
                <p className="eyebrow">Database unavailable</p>
                <h2 className="mt-2 font-display text-xl font-bold">The metrics could not be loaded</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                  The site could not reach the database, so there is nothing to show right now.
                  Reload in a minute. If it keeps happening, check that SUPABASE_DB_URL is set and
                  the Supabase project is running. The server log has the error.
                </p>
              </div>
            ),
          }}
        />
      </>
    );
  }

  const { days, pages, snippets, buttons, inbox, messages, stars, ratings } = data;
  const today = days[days.length - 1];
  const sum = (pick: (d: Day) => number) => days.reduce((s, d) => s + pick(d), 0);
  const series = (pick: (d: Day) => number) => days.map((d) => ({ day: d.day, n: pick(d) }));

  const starCount = (s: number) => stars.find((r) => r.stars === s)?.n ?? 0;
  const ratingTotal = stars.reduce((s, r) => s + r.n, 0);
  const ratingAvg = ratingTotal ? stars.reduce((s, r) => s + r.stars * r.n, 0) / ratingTotal : null;
  const starPeak = Math.max(1, ...stars.map((r) => r.n));

  const avgValue =
    ratingAvg === null ? (
      <span className="text-ink-faint">–</span>
    ) : (
      <>
        {ratingAvg.toFixed(1)}
        <span className="text-lg font-semibold text-ink-soft"> / 5</span>
      </>
    );
  const avgNote = ratingAvg === null ? "No ratings yet" : `From ${plural(ratingTotal, "rating", "ratings")}`;

  const totals = {
    views: sum((d) => d.views),
    demos: sum((d) => d.demos),
    plays: sum((d) => d.plays),
    copies: sum((d) => d.copies),
  };
  const pair = (label: string, total: number, todayN: number) => (
    <div className="grid grid-cols-2 gap-4 sm:max-w-md">
      <Stat label={`${label}, 30 days`} value={<CountUp to={total} duration={900} />} note="Last 30 days" />
      <Stat label={`${label}, today`} value={<CountUp to={todayN} duration={900} />} note={longDay(today.day)} />
    </div>
  );

  const sections = {
    overview: (
      <>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
          <Stat href="#traffic" label="Page views" value={<CountUp to={totals.views} duration={900} />} note={`${num(today.views)} today`} spark={days.map((d) => d.views)} />
          <Stat href="#demo" label="Demo clicks" value={<CountUp to={totals.demos} duration={900} />} note={`${num(today.demos)} today`} spark={days.map((d) => d.demos)} />
          <Stat href="#arcade" label="Arcade plays" value={<CountUp to={totals.plays} duration={900} />} note={`${num(today.plays)} today`} spark={days.map((d) => d.plays)} />
          <Stat href="#copies" label="Code copies" value={<CountUp to={totals.copies} duration={900} />} note={`${num(today.copies)} today`} spark={days.map((d) => d.copies)} />
          <Stat href="#messages" label="Messages" value={<CountUp to={inbox.total} duration={900} />} note={`${num(inbox.contact)} from the contact form`} />
          <Stat href="#ratings" label="Average rating" value={avgValue} note={avgNote} />
        </div>
        <ColumnChart title="Daily page views" one="page view" many="page views" data={series((d) => d.views)} />
        <div className="grid gap-6 lg:grid-cols-3">
          <ColumnChart small title="Demo clicks per day" one="click" many="clicks" data={series((d) => d.demos)} />
          <ColumnChart small title="Arcade plays per day" one="play" many="plays" data={series((d) => d.plays)} />
          <ColumnChart small title="Code copies per day" one="copy" many="copies" data={series((d) => d.copies)} />
        </div>
      </>
    ),
    traffic: (
      <>
        {pair("Page views", totals.views, today.views)}
        <ColumnChart title="Daily page views" one="page view" many="page views" data={series((d) => d.views)} />
        <Panel title="Top pages" note="Views, last 30 days">
          <RankList rows={pages} mono empty="No page views recorded yet." />
        </Panel>
      <details open className="card-quiet px-5 py-3 text-sm sm:px-6">
        <summary className="cursor-pointer font-medium text-ink-soft hover:text-ink">
          Daily numbers as a table
        </summary>
        <div className="table-scroll mt-3">
          <table className="w-full text-left tabular-nums">
            <thead className="text-xs text-ink-soft">
              <tr className="border-b border-ink-line">
                <th className="py-2 pr-4 font-medium">Day</th>
                <th className="py-2 pr-4 text-right font-medium">Page views</th>
                <th className="py-2 pr-4 text-right font-medium">Demo clicks</th>
                <th className="py-2 pr-4 text-right font-medium">Arcade plays</th>
                <th className="py-2 text-right font-medium">Code copies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-line">
              {[...days].reverse().map((d) => (
                <tr key={d.day}>
                  <th scope="row" className="whitespace-nowrap py-1.5 pr-4 font-normal">
                    {longDay(d.day)}
                  </th>
                  <td className="py-1.5 pr-4 text-right">{num(d.views)}</td>
                  <td className="py-1.5 pr-4 text-right">{num(d.demos)}</td>
                  <td className="py-1.5 pr-4 text-right">{num(d.plays)}</td>
                  <td className="py-1.5 text-right">{num(d.copies)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      </>
    ),
    demo: (
      <>
        {pair("Demo clicks", totals.demos, today.demos)}
        <ColumnChart title="Demo clicks per day" one="click" many="clicks" data={series((d) => d.demos)} />
        <Panel title="Demo clicks by button" note="Clicks, last 30 days">
          <RankList rows={buttons} mono empty="Nobody has clicked a Book a demo link yet." />
        </Panel>
      </>
    ),
    arcade: (
      <>
        {pair("Arcade plays", totals.plays, today.plays)}
        <ColumnChart title="Arcade plays per day" one="play" many="plays" data={series((d) => d.plays)} />
      </>
    ),
    copies: (
      <>
        {pair("Code copies", totals.copies, today.copies)}
        <ColumnChart title="Code copies per day" one="copy" many="copies" data={series((d) => d.copies)} />
        <Panel title="Most copied code" note="Copies, last 30 days">
          <RankList rows={snippets} mono empty="Nobody has copied a snippet yet." />
        </Panel>
      </>
    ),
    messages: (
        <Panel
          title="Messages"
          note={
            inbox.total > messages.length
              ? `Newest ${messages.length} of ${num(inbox.total)}`
              : "Newest first"
          }
        >
          {messages.length === 0 ? (
            <Empty>No messages yet. The contact form and the feedback page both land here.</Empty>
          ) : (
            <ul className="divide-y divide-ink-line">
              {messages.map((m) => (
                <li key={m.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="font-semibold">{m.name?.trim() || "No name given"}</span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                        m.source === "contact"
                          ? "border-ink bg-crow-tint text-ink"
                          : "border-ink-line bg-paper-deep text-ink-soft"
                      }`}
                    >
                      {m.source === "contact" ? "Contact form" : "Feedback page"}
                    </span>
                    <time
                      dateTime={m.created_at}
                      className="ml-auto font-mono text-xs text-ink-soft"
                    >
                      {when(m.created_at)}
                    </time>
                  </div>
                  {m.email?.trim() ? (
                    <a
                      href={`mailto:${m.email.trim()}`}
                      className="mt-1 inline-block break-all text-sm text-ink-soft underline decoration-ink-line underline-offset-4 hover:text-ink hover:decoration-crow"
                    >
                      {m.email.trim()}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-ink-soft">No email given</p>
                  )}
                  <p className="mt-3 max-w-prose whitespace-pre-wrap text-[15px] leading-relaxed [overflow-wrap:anywhere]">
                    {m.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
    ),
    ratings: (
      <>
        <div className="grid grid-cols-2 gap-4 sm:max-w-md">
          <Stat label="Ratings" value={num(ratingTotal)} note="All time" />
          <Stat label="Average rating" value={avgValue} note={avgNote} />
        </div>
        <div className="grid items-start gap-6 xl:grid-cols-2">
        <Panel
          title="Rating distribution"
          note={ratingTotal ? plural(ratingTotal, "rating", "ratings") : undefined}
        >
          {ratingTotal === 0 ? (
            <Empty>No ratings yet. They come from the star widget on the site.</Empty>
          ) : (
            <ul aria-label="Number of ratings for each star value">
              {[5, 4, 3, 2, 1].map((s) => {
                const n = starCount(s);
                return (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    <span className="w-8 shrink-0 font-mono text-xs text-ink-soft">
                      <span aria-hidden>{s} ★</span>
                      <span className="sr-only">{s} stars:</span>
                    </span>
                    <span className="flex-1 border-l border-ink-faint py-2">
                      <span
                        className="admin-grow block h-3 rounded-r bg-ink"
                        style={{ width: n ? `max(${(n / starPeak) * 100}%, 3px)` : 0 }}
                      />
                    </span>
                    <span className="w-7 text-right font-semibold tabular-nums">{num(n)}</span>
                    <span className="w-9 text-right text-xs tabular-nums text-ink-soft">
                      {Math.round((n / ratingTotal) * 100)}%
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
        <Panel title="Recent ratings" note="Newest first">
          {ratings.length === 0 ? (
            <Empty>No ratings yet.</Empty>
          ) : (
            <ul className="divide-y divide-ink-line">
              {ratings.map((r) => (
                <li key={r.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <Stars n={r.stars} />
                    <time
                      dateTime={r.created_at}
                      className="font-mono text-xs text-ink-soft"
                    >
                      {when(r.created_at)}
                    </time>
                  </div>
                  {r.comment?.trim() ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed [overflow-wrap:anywhere]">
                      {r.comment}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-ink-soft">No comment</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
        </div>
      </>
    ),
  };

  return (
    <>
      {gaOff}
      <AdminShell
        note={note}
        footer={footer}
        sections={sections}
        views={[
          { id: "overview", label: "Overview" },
          { id: "traffic", label: "Page views", count: totals.views },
          { id: "demo", label: "Demo clicks", count: totals.demos },
          { id: "arcade", label: "Arcade", count: totals.plays },
          { id: "copies", label: "Code copies", count: totals.copies },
          { id: "messages", label: "Messages", count: inbox.total },
          { id: "ratings", label: "Ratings", count: ratingTotal },
        ]}
      />
    </>
  );
}
