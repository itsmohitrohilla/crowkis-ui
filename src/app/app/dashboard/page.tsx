import { Reveal } from "@/components/ui/motion";
import { appMetrics, hitBreakdown } from "@/lib/content";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-3xl font-semibold">Crowkis Dashboard</h1>
        <p className="mt-2 text-slate-300">Real-time control plane preview for cache value, quality, and safety.</p>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {appMetrics.map((item) => (
          <div key={item.label} className="glass p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            <p className="mt-1 text-sm text-brand-neon">{item.delta}</p>
          </div>
        ))}
      </div>
      <div className="glass p-5">
        <h2 className="text-xl font-semibold">Hit Type Breakdown</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {hitBreakdown.map((item) => (
            <div key={item.kind} className="rounded-xl border border-glass-200 bg-white/5 p-4">
              <p className="text-sm text-slate-300">{item.kind}</p>
              <p className={`mt-1 text-2xl font-semibold ${item.tint}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
