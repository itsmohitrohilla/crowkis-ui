import { liveFeed } from "@/lib/content";

export default function LiveLogPage() {
  return (
    <div className="glass p-4 sm:p-5">
      <h1 className="text-2xl font-semibold">Live Query Log</h1>
      <p className="mt-1 text-sm text-slate-300">Streaming activity feed for hits, misses, blocks, and confidence.</p>
      <div className="table-scroll mt-4">
      <div className="space-y-2 font-mono text-xs">
        {liveFeed.map((line) => (
          <div key={line} className="min-w-[580px] rounded-lg border border-glass-200 bg-black/25 px-3 py-2 text-slate-200 sm:min-w-0">
            {line}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
