import { tenantRows } from "@/lib/content";

export default function TenantsPage() {
  return (
    <div className="glass p-4 sm:p-5">
      <h1 className="text-2xl font-semibold">Tenant Performance</h1>
      <p className="mt-1 text-sm text-slate-300">Per-tenant requests, hit quality, savings, and risk signal.</p>
      <div className="table-scroll mt-5">
      <table className="table-compact">
        <thead className="text-slate-400">
          <tr className="border-b border-glass-200">
            {["Tenant", "Requests", "Hit rate", "Tokens saved", "$ Saved", "Blocked"].map((h) => (
              <th key={h} className="px-3 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tenantRows.map((row) => (
            <tr key={row[0]} className="border-b border-glass-200/60">
              {row.map((value, idx) => (
                <td key={value + idx} className={`px-3 py-3 ${idx === 5 && value !== "0" ? "text-brand-danger" : ""}`}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
