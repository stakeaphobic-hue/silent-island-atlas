import { ISLAND_PATH, COUNTESS_PATH } from "@/data/island";
import { FRONTS, type Front } from "@/data/fronts";

export function FrontsMap({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const links = uniqueLinks(FRONTS);

  return (
    <div className="relative h-full min-h-0 bg-water">
      <svg
        viewBox="0 0 1100 640"
        className="h-full w-full"
        role="img"
        aria-label="Fronts map of Silent Island. Storms, clocks, and blanks — not streets."
      >
        <rect width="1100" height="640" fill="var(--color-water)" />
        <text
          x="40"
          y="36"
          fill="var(--color-subtle-fg)"
          fontSize="11"
          fontFamily="var(--font-sans)"
          letterSpacing="0.22em"
        >
          DRAW MAPS, LEAVE BLANKS
        </text>

        <g transform="translate(48 150) scale(0.38)" opacity="0.35">
          <path d={ISLAND_PATH} fill="var(--color-ink)" stroke="var(--color-paper)" strokeWidth="8" />
          <path d={COUNTESS_PATH} fill="var(--color-ink)" stroke="var(--color-brass)" strokeWidth="8" />
        </g>

        <text x="160" y="310" fill="var(--color-weirding)" fontSize="11" fontFamily="var(--font-sans)" opacity="0.7">
          Weirding
        </text>
        <text x="390" y="280" fill="var(--color-silent)" fontSize="11" fontFamily="var(--font-sans)" opacity="0.7">
          Silent
        </text>
        <text x="560" y="340" fill="var(--color-eerier)" fontSize="11" fontFamily="var(--font-sans)" opacity="0.7">
          Eerier
        </text>
        <text x="700" y="248" fill="var(--color-countess)" fontSize="11" fontFamily="var(--font-sans)" opacity="0.7">
          Countess · Gilded Grove
        </text>

        {links.map(([a, b]) => {
          const from = FRONTS.find((f) => f.id === a);
          const to = FRONTS.find((f) => f.id === b);
          if (!from || !to) return null;
          const bleed = from.kind === "bleed" || to.kind === "bleed" || from.kind === "blank" || to.kind === "blank";
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x + 96}
              y1={from.y + 36}
              x2={to.x + 96}
              y2={to.y + 36}
              stroke="var(--color-paper)"
              strokeOpacity={bleed ? 0.22 : 0.16}
              strokeWidth="1.25"
              strokeDasharray={bleed ? "5 6" : undefined}
            />
          );
        })}

        {FRONTS.map((f) => (
          <FrontNode
            key={f.id}
            front={f}
            active={selected === f.id}
            onSelect={onSelect}
          />
        ))}
      </svg>
    </div>
  );
}

function FrontNode({
  front,
  active,
  onSelect,
}: {
  front: Front;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const blank = front.kind === "blank";
  return (
    <g
      transform={`translate(${front.x} ${front.y})`}
      className="cursor-pointer"
      onClick={() => onSelect(front.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(front.id);
        }
      }}
      aria-label={`${front.name}, ${front.kind}, clock ${front.clock}`}
    >
      <rect
        width="192"
        height="72"
        rx="10"
        fill={active ? "var(--color-elevated)" : "var(--color-ink)"}
        stroke={active ? "var(--color-brass)" : "var(--color-paper)"}
        strokeOpacity={active ? 0.9 : blank ? 0.28 : 0.18}
        strokeDasharray={blank ? "4 4" : undefined}
        strokeWidth={active ? 1.75 : 1}
      />
      <g transform="translate(10 16)">
        <ClockFace hour={front.clock} blank={blank} />
      </g>
      <text
        x="54"
        y="28"
        fill="var(--color-paper)"
        fontSize="13"
        fontFamily="var(--font-display)"
      >
        {front.name.length > 22 ? `${front.name.slice(0, 21)}…` : front.name}
      </text>
      <text
        x="54"
        y="48"
        fill="var(--color-muted)"
        fontSize="10"
        fontFamily="var(--font-sans)"
      >
        {blank ? "blank" : `${labelKind(front.kind)} · ${front.clock}:00`}
      </text>
    </g>
  );
}

export function ClockFace({
  hour,
  blank,
  size = 40,
}: {
  hour: number;
  blank?: boolean;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 3;
  const clamped = Math.max(0, Math.min(12, hour));
  const rad = (clamped / 12) * 2 * Math.PI - Math.PI / 2;
  const x = cx + r * Math.cos(rad);
  const y = cy + r * Math.sin(rad);
  const large = clamped > 6 ? 1 : 0;
  const wedge =
    clamped === 0
      ? ""
      : clamped === 12
        ? `M ${cx} ${cy} m 0 ${-r} a ${r} ${r} 0 1 1 0 ${r * 2} a ${r} ${r} 0 1 1 0 ${-r * 2}`
        : `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${x} ${y} Z`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="transparent"
        stroke="var(--color-paper)"
        strokeOpacity={blank ? 0.25 : 0.45}
        strokeWidth="1.25"
        strokeDasharray={blank ? "2 3" : undefined}
      />
      {wedge && !blank && (
        <path d={wedge} fill="var(--color-brass)" fillOpacity="0.55" />
      )}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const inner = r - (i % 3 === 0 ? 4 : 2);
        return (
          <line
            key={i}
            x1={cx + inner * Math.cos(a)}
            y1={cy + inner * Math.sin(a)}
            x2={cx + r * Math.cos(a)}
            y2={cy + r * Math.sin(a)}
            stroke="var(--color-paper)"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

function labelKind(kind: Front["kind"]) {
  switch (kind) {
    case "warlord":
      return "Warlord";
    case "ambition":
      return "Ambition";
    case "veil":
      return "Veil";
    case "landscape":
      return "Landscape";
    case "bleed":
      return "Bleed";
    default:
      return "Blank";
  }
}

function uniqueLinks(fronts: Front[]) {
  const seen = new Set<string>();
  const out: [string, string][] = [];
  for (const f of fronts) {
    for (const other of f.reach ?? []) {
      const key = [f.id, other].sort().join(":");
      if (seen.has(key)) continue;
      seen.add(key);
      out.push([f.id, other]);
    }
  }
  return out;
}
