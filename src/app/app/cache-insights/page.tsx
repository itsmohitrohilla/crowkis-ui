import { modelRows } from "@/lib/content";

export default function CacheInsightsPage() {
  return (
    <div className="space-y-6">
      <div className="glass p-4 sm:p-5">
        <h1 className="text-2xl font-semibold">Cache Insights</h1>
        <p className="mt-1 text-sm text-slate-300">Model-level avoided calls and cost-protection view.</p>
      </div>
      <div className="glass p-4 sm:p-5">
        <div className="table-scroll">
        <table className="table-compact">
          <thead className="text-slate-400">
            <tr className="border-b border-glass-200">
              {["Model", "Hits", "Tokens Saved", "Cost Avoided"].map((h) => (
                <th key={h} className="px-3 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modelRows.map((row) => (
              <tr key={row[0]} className="border-b border-glass-200/60">
                {row.map((value, idx) => (
                  <td key={value + idx} className="px-3 py-3">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
