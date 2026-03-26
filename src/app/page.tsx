const COLOR_BARS = [
  { color: "#000000", width: 100 },
  { color: "#1a0800", width: 95 },
  { color: "#4a0000", width: 90 },
  { color: "#0a0a6e", width: 85 },
  { color: "#1a5fc8", width: 80 },
  { color: "#4f6fd4", width: 75 },
  { color: "#9966cc", width: 70 },
  { color: "#cc44cc", width: 65 },
  { color: "#ee55aa", width: 60 },
  { color: "#f0a030", width: 55 },
  { color: "#88ee44", width: 50 },
  { color: "#aaaaaa", width: 45 },
  { color: "#cccccc", width: 40 },
];


export default function Home() {
  return (
    <main style={{ background: "#fff", minHeight: "100vh" }}>

      {/* Logo – edge to edge, full viewport width */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Crowkis"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {/* Color bars – edge to edge, full viewport width */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {COLOR_BARS.map((bar) => (
          <span
            key={bar.color}
            className="color-bar"
            style={{ background: bar.color, width: `${bar.width}%` }}
          />
        ))}
      </div>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero-section" style={{ maxWidth: 980, margin: "0 auto", paddingTop: 8 }}>

        {/* Tagline */}
        <p
          className="tagline"
          style={{
            textAlign: "center",
            fontFamily: "var(--font-pinyon), cursive",
            fontStyle: "normal",
            fontSize: "clamp(22px, 2.5vw, 32px)",
            lineHeight: 1.65,
            color: "#222",
            marginTop: 32,
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          The intelligent brain that decides how LLM responses are reused safely,
          <br />
          efficiently, and at scale. Built in Rust <span style={{ fontStyle: "normal" }}>❤️</span>
        </p>

        {/* Coming Soon */}
        <div
          className="coming-soon-wrap"
          style={{
            textAlign: "center",
            marginTop: 40,
            paddingBottom: 48,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/coming-soon.png"
            alt="Coming Soon"
            style={{ width: "100%", maxWidth: 900, height: "auto", display: "inline-block" }}
          />
        </div>
      </section>


      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{ background: "#f5f5f5", color: "#111", padding: "60px 24px 32px" }}>
        <div
          className="footer-grid"
          style={{
            maxWidth: 980,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
            marginBottom: 40,
          }}
        >
          {/* Brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Crowkis"
              style={{ width: 160, height: "auto", marginBottom: 12 }}
            />
            <p style={{ color: "#555", fontSize: 13, lineHeight: 1.6 }}>
              The intelligent brain that decides how LLM responses are reused
              safely, efficiently, and at scale.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontWeight: 700,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#777",
                marginBottom: 14,
              }}
            >
              Contact
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                // { label: "hello@crowkis.io", href: "mailto:hello@crowkis.io" },
                // { label: "X / Twitter",      href: "https://x.com/crowkis" },
                { label: "LinkedIn",         href: "https://www.linkedin.com/company/crowkis/?viewAsMember=true" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="footer-link"
                    style={{ color: "#444", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom"
          style={{
            maxWidth: 980,
            margin: "0 auto",
            borderTop: "1px solid #ddd",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ color: "#888", fontSize: 13 }}>
            © {new Date().getFullYear()} Crowkis. All rights reserved.
          </span>
          <span style={{ color: "#888", fontSize: 13 }}>Built in Rust ❤️</span>
        </div>
      </footer>

    </main>
  );
}
