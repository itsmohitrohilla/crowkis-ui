/**
 * The footer forest: a green pixel garden running under the footer links —
 * fruit trees, bushes, grass, and a small murder of crows always perched and
 * blinking, plus one drifting flyer. Pure SVG + CSS, pixel style with ink
 * outlines and crow-red fruit so it stays in the family.
 */

const INK = "#16130e";
const WING = "#37322a";
const EYE = "#d62221";
const LEAF = "#7fae6a";
const LEAF_DARK = "#5d8a4e";
const LEAF_LIGHT = "#a3c98b";
const FRUIT = "#d62221";

function PerchedCrow({ x, bottom, flip, delay }: { x: string; bottom: number; flip?: boolean; delay: string }) {
  return (
    <svg
      viewBox="0 0 16 12"
      style={{ left: x, bottom, animationDelay: delay, transform: flip ? "scaleX(-1)" : undefined }}
      className="absolute h-[32px] w-auto"
      aria-hidden
    >
      <rect x="9" y="0" width="4" height="4" fill={INK} />
      <rect x="13" y="1" width="2" height="1" fill={INK} />
      <rect x="3" y="3" width="8" height="5" fill={INK} />
      <rect x="8" y="2" width="2" height="1" fill={INK} />
      <rect x="0" y="3" width="3" height="2" fill={INK} />
      <rect x="4" y="4" width="5" height="3" fill={WING} />
      <rect x="6" y="8" width="1" height="2" fill={INK} />
      <rect x="9" y="8" width="1" height="2" fill={INK} />
      <rect x="5" y="10" width="2" height="1" fill={INK} />
      <rect x="8" y="10" width="2" height="1" fill={INK} />
      <rect className="footer-crow-eye" x="11" y="1" width="1" height="1" fill={EYE} style={{ animationDelay: delay }} />
    </svg>
  );
}

function FruitTree({ x, h, flip }: { x: string; h: number; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 100"
      style={{ left: x, height: h, transform: flip ? "scaleX(-1)" : undefined }}
      className="absolute bottom-[36px] w-auto"
      aria-hidden
    >
      {/* trunk + branches */}
      <rect x="26" y="42" width="8" height="58" fill={INK} />
      <rect x="18" y="50" width="10" height="5" fill={INK} />
      <rect x="34" y="38" width="14" height="5" fill={INK} />
      {/* canopy blocks */}
      <rect x="8" y="8" width="44" height="36" fill={LEAF} stroke={INK} strokeWidth="2.5" />
      <rect x="2" y="24" width="20" height="18" fill={LEAF_DARK} stroke={INK} strokeWidth="2.5" />
      <rect x="38" y="20" width="20" height="18" fill={LEAF_LIGHT} stroke={INK} strokeWidth="2.5" />
      <rect x="16" y="2" width="24" height="14" fill={LEAF_LIGHT} stroke={INK} strokeWidth="2.5" />
      {/* fruit */}
      <rect x="14" y="16" width="5" height="5" fill={FRUIT} stroke={INK} strokeWidth="1.5" />
      <rect x="40" y="26" width="5" height="5" fill={FRUIT} stroke={INK} strokeWidth="1.5" />
      <rect x="27" y="30" width="5" height="5" fill={FRUIT} stroke={INK} strokeWidth="1.5" />
      <rect x="8" y="32" width="4" height="4" fill={FRUIT} stroke={INK} strokeWidth="1.5" />
      <rect x="48" y="10" width="4" height="4" fill={FRUIT} stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

function Bush({ x, w = 54 }: { x: string; w?: number }) {
  return (
    <svg viewBox="0 0 40 18" style={{ left: x, width: w }} className="absolute bottom-[34px] h-auto" aria-hidden>
      <rect x="2" y="6" width="16" height="12" fill={LEAF_DARK} stroke={INK} strokeWidth="2" />
      <rect x="12" y="2" width="18" height="16" fill={LEAF} stroke={INK} strokeWidth="2" />
      <rect x="26" y="8" width="12" height="10" fill={LEAF_LIGHT} stroke={INK} strokeWidth="2" />
      <rect x="18" y="7" width="4" height="4" fill={FRUIT} stroke={INK} strokeWidth="1.2" />
    </svg>
  );
}

function Grass({ x }: { x: string }) {
  return (
    <svg viewBox="0 0 12 8" style={{ left: x }} className="absolute bottom-[34px] h-[14px] w-auto" aria-hidden>
      <rect x="1" y="3" width="2" height="5" fill={LEAF_DARK} />
      <rect x="5" y="0" width="2" height="8" fill={LEAF} />
      <rect x="9" y="4" width="2" height="4" fill={LEAF_DARK} />
    </svg>
  );
}

export function FooterGarden({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative h-[180px] overflow-hidden">
      {/* sun */}
      <div className="absolute right-[5%] top-4 h-10 w-10 rounded-full border-2 border-ink bg-crow-tint" />

      {/* drifting flyer */}
      <svg viewBox="0 0 16 12" className="footer-flyer absolute top-5 h-[26px] w-auto">
        <rect x="10" y="0" width="4" height="4" fill={INK} />
        <rect x="14" y="1" width="2" height="1" fill={INK} />
        <rect x="9" y="3" width="2" height="2" fill={INK} />
        <rect x="3" y="4" width="8" height="4" fill={INK} />
        <rect x="0" y="5" width="3" height="2" fill={INK} />
        <rect className="footer-flyer-wing" x="4" y="0" width="5" height="3" fill={WING} />
        <rect x="12" y="1" width="1" height="1" fill={EYE} />
      </svg>

      {/* the forest */}
      <FruitTree x="2%" h={120} />
      <FruitTree x="13%" h={96} flip />
      <FruitTree x="28%" h={132} />
      <FruitTree x="44%" h={88} flip />
      <FruitTree x="57%" h={124} />
      <FruitTree x="73%" h={100} flip />
      <FruitTree x="87%" h={128} />
      <Bush x="9%" />
      <Bush x="23%" w={44} />
      <Bush x="39%" />
      <Bush x="52%" w={42} />
      <Bush x="68%" />
      <Bush x="82%" w={46} />
      <Grass x="6%" />
      <Grass x="19%" />
      <Grass x="35%" />
      <Grass x="49%" />
      <Grass x="64%" />
      <Grass x="78%" />
      <Grass x="94%" />

      {/* five crows, always sitting: on canopies and the ground */}
      <PerchedCrow x="4.5%" bottom={128} delay="0s" />
      <PerchedCrow x="30.5%" bottom={140} flip delay="1.4s" />
      <PerchedCrow x="59%" bottom={132} delay="2.3s" />
      <PerchedCrow x="89%" bottom={136} flip delay="0.8s" />
      <PerchedCrow x="47%" bottom={34} delay="3.1s" />

      {/* the lawn — copyright lives on the grass */}
      <div className="absolute bottom-0 left-0 right-0 h-[34px] border-t-2 border-ink" style={{ background: LEAF_DARK }}>
        <div className="section flex h-full items-center justify-between gap-2 font-mono text-[11px]" style={{ color: "#f0ead9" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
