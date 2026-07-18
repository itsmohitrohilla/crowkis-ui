/**
 * CrowBot, the Crowkis mascot. A smart, slightly smug crow robot: visor eyes
 * that blink and scan, a crest of feathers, an antenna pinging away, one wing
 * holding the red Crowkis cube, and saved coins drifting up. Pure SVG + CSS,
 * no JavaScript.
 */
export function CrowBot({ size = 260, accent = "#d62221" }: { size?: number; accent?: string }) {
  return (
    <div className="crowbot inline-block" style={{ width: size }} aria-hidden>
      <svg viewBox="0 0 260 300" width={size} height={(size * 300) / 260}>
        {/* ground shadow */}
        <ellipse className="bot-shadow" cx="130" cy="284" rx="58" ry="9" fill="#16130e" opacity="0.25" />

        <g className="bot-float">
          {/* antenna */}
          <g>
            <circle className="bot-ping" cx="130" cy="22" r="7" fill="none" stroke={accent} strokeWidth="2" />
            <circle className="bot-ping bot-ping-2" cx="130" cy="22" r="7" fill="none" stroke={accent} strokeWidth="2" />
            <circle cx="130" cy="22" r="5" fill={accent} stroke="#16130e" strokeWidth="2.5" />
            <rect x="127.5" y="26" width="5" height="16" rx="2" fill="#16130e" />
          </g>

          {/* crest feathers */}
          <path d="M104 52 L96 34 L112 44 Z" fill="#16130e" />
          <path d="M122 46 L120 28 L132 42 Z" fill="#16130e" />
          <path d="M148 50 L158 34 L142 44 Z" fill="#16130e" />

          {/* head */}
          <rect x="78" y="42" width="104" height="78" rx="36" fill="#fffdf9" stroke="#16130e" strokeWidth="3" />
          {/* visor */}
          <rect x="92" y="62" width="76" height="34" rx="16" fill="#16130e" />
          {/* eyes inside visor */}
          <g className="bot-eyes">
            <circle className="bot-eye" cx="116" cy="79" r="6" fill="#d62221" />
            <circle className="bot-eye" cx="144" cy="79" r="6" fill="#d62221" />
            <circle cx="118" cy="77" r="2" fill="#fffdf9" />
            <circle cx="146" cy="77" r="2" fill="#fffdf9" />
          </g>
          {/* beak */}
          <path d="M124 100 L136 100 L130 112 Z" fill="#d62221" stroke="#16130e" strokeWidth="2.5" strokeLinejoin="round" />

          {/* body */}
          <path
            d="M88 122 q42 -14 84 0 q10 36 -6 64 q-36 14 -72 0 q-16 -28 -6 -64 Z"
            fill="#fffdf9"
            stroke="#16130e"
            strokeWidth="3"
          />
          {/* chest band (accent) */}
          <path
            d="M85 150 q45 -12 90 0 l-4 24 q-41 12 -82 0 Z"
            fill={accent}
            stroke="#16130e"
            strokeWidth="3"
          />
          {/* emblem on the band: mini cube */}
          <g transform="translate(118,152)">
            <rect x="0" y="4" width="22" height="14" rx="3" fill="#a91716" stroke="#16130e" strokeWidth="2" />
            <rect x="0" y="0" width="22" height="10" rx="3" fill="#fffdf9" stroke="#16130e" strokeWidth="2" />
            <path d="M5 5 L11 2 L17 5 L11 8 Z" fill="#16130e" />
          </g>

          {/* tail feathers */}
          <path d="M168 196 L196 214 L170 212 Z" fill="#16130e" />
          <path d="M164 204 L186 226 L162 218 Z" fill="#37322a" />

          {/* right wing, tucked */}
          <path
            d="M174 138 q26 10 18 44 q-8 18 -22 18 q12 -30 4 -62 Z"
            fill="#37322a"
            stroke="#16130e"
            strokeWidth="3"
          />

          {/* left wing holding the cube tray */}
          <path
            d="M86 140 q-30 6 -34 34 q-2 16 12 18 q4 -26 28 -38 Z"
            fill="#37322a"
            stroke="#16130e"
            strokeWidth="3"
          />
          <ellipse cx="58" cy="192" rx="22" ry="7" fill="#fffdf9" stroke="#16130e" strokeWidth="3" />

          {/* the crowkis cube on the tray */}
          <g className="bot-cube">
            <g transform="translate(36,148)">
              <path d="M22 0 L44 10 L44 28 L22 38 L0 28 L0 10 Z" fill="#d62221" stroke="#16130e" strokeWidth="3" strokeLinejoin="round" />
              <path d="M0 10 L22 20 L44 10" fill="none" stroke="#16130e" strokeWidth="2.5" />
              <path d="M22 20 L22 38" fill="none" stroke="#16130e" strokeWidth="2.5" />
              <path d="M10 8 q6 -7 14 -3 q-2 6 -8 6 q6 1 8 5 q-8 3 -14 -2 Z" fill="#16130e" />
            </g>
          </g>

          {/* legs */}
          <rect x="112" y="186" width="7" height="18" rx="3" fill="#16130e" />
          <rect x="140" y="186" width="7" height="18" rx="3" fill="#16130e" />
          <path d="M106 204 h20 l-4 6 h-12 Z" fill="#16130e" />
          <path d="M134 204 h20 l-4 6 h-12 Z" fill="#16130e" />
        </g>

        {/* saved coins drifting up */}
        <g className="bot-coin">
          <circle cx="208" cy="150" r="11" fill="#fffdf9" stroke="#16130e" strokeWidth="2.5" />
          <text x="208" y="155" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontWeight="700" fontSize="12" fill={accent}>$</text>
        </g>
        <g className="bot-coin bot-coin-2">
          <circle cx="226" cy="186" r="8" fill="#fffdf9" stroke="#16130e" strokeWidth="2.5" />
          <text x="226" y="190" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontWeight="700" fontSize="9" fill={accent}>$</text>
        </g>
      </svg>
    </div>
  );
}
