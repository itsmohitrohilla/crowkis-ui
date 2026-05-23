export default function SettingsPage() {
  const items = [
    "CROWKIS_ADMIN_KEY configured",
    "CROWKIS_AUTH_TOKEN configured",
    "Management auth required on non-loopback deployments",
    "PII previews disabled in logs by default",
  ];

  return (
    <div className="space-y-6">
      <div className="glass p-4 sm:p-5">
        <h1 className="text-2xl font-semibold">Security & Operations Settings</h1>
        <p className="mt-1 text-sm text-slate-300">Controls aligned with documented Crowkis deployment safety defaults.</p>
      </div>
      <div className="glass p-4 sm:p-5">
        <h2 className="text-lg font-medium">Readiness Checklist</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-200">
          {items.map((item) => (
            <li key={item} className="rounded-lg border border-glass-200 bg-white/5 px-3 py-2 break-words">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
