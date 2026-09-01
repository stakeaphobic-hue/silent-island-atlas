import { SHORE_TOWNS, type ShoreTown } from "@/data/shore";

export function ShoreMap({
  selected,
  onSelect,
  onIsland,
  onNewYork,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  onIsland: () => void;
  onNewYork: () => void;
}) {
  return (
    <div className="relative h-full min-h-0 bg-water">
      <svg
        viewBox="0 0 1100 640"
        className="h-full w-full"
        role="img"
        aria-label="Shore chart of East Fairfield County and New Haven, Long Island Sound to the south."
      >
        <rect width="1100" height="640" fill="var(--color-water)" />

        <path
          d="M 0 0 L 1100 0 L 1100 360 C 980 348 900 368 820 352 C 700 330 620 368 520 350 C 430 334 360 372 280 350 C 180 324 90 360 0 340 Z"
          fill="var(--color-ink)"
        />

        <path
          d="M 430 40 C 445 140 452 220 458 310 C 462 340 470 355 490 368"
          fill="none"
          stroke="var(--color-water)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <line
          x1="40"
          y1="270"
          x2="1040"
          y2="258"
          stroke="var(--color-steel)"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeDasharray="10 8"
        />
        <text
          x="60"
          y="262"
          fill="var(--color-subtle-fg)"
          fontSize="10"
          fontFamily="var(--font-sans)"
          letterSpacing="0.18em"
        >
          I-95
        </text>

        <line
          x1="500"
          y1="58"
          x2="470"
          y2="340"
          stroke="var(--color-steel)"
          strokeOpacity="0.3"
          strokeWidth="2"
          strokeDasharray="8 7"
        />
        <text
          x="512"
          y="120"
          fill="var(--color-subtle-fg)"
          fontSize="10"
          fontFamily="var(--font-sans)"
          letterSpacing="0.18em"
        >
          RT 8
        </text>

        <text
          x="40"
          y="28"
          fill="var(--color-subtle-fg)"
          fontSize="11"
          fontFamily="var(--font-sans)"
          letterSpacing="0.22em"
        >
          EAST FAIRFIELD · WATERBURY · NEW HAVEN · THE SOUND
        </text>
        <text
          x="40"
          y="430"
          fill="var(--color-paper)"
          fillOpacity="0.35"
          fontSize="12"
          fontFamily="var(--font-display)"
        >
          Long Island Sound
        </text>

        <g
          className="cursor-pointer"
          onClick={onIsland}
          role="button"
          tabIndex={0}
          aria-label="Silent Island, open island chart"
        >
          <ellipse cx="330" cy="510" rx="78" ry="32" fill="var(--color-ink)" stroke="var(--color-brass)" strokeWidth="1.5" />
          <ellipse cx="430" cy="498" rx="22" ry="14" fill="var(--color-ink)" stroke="var(--color-brass)" strokeOpacity="0.6" />
          <text
            x="330"
            y="514"
            textAnchor="middle"
            fill="var(--color-brass)"
            fontSize="11"
            fontFamily="var(--font-sans)"
          >
            Silent Island
          </text>
        </g>

        <g
          className="cursor-pointer"
          onClick={onNewYork}
          role="button"
          tabIndex={0}
          aria-label="New York, off this chart"
        >
          <rect
            x="16"
            y="548"
            width="168"
            height="56"
            rx="10"
            fill="var(--color-ink)"
            stroke="var(--color-paper)"
            strokeOpacity="0.28"
            strokeDasharray="4 4"
          />
          <text x="32" y="572" fill="var(--color-muted)" fontSize="12" fontFamily="var(--font-display)">
            New York →
          </text>
          <text x="32" y="590" fill="var(--color-subtle-fg)" fontSize="10" fontFamily="var(--font-sans)">
            off this chart
          </text>
        </g>

        {SHORE_TOWNS.map((t) => (
          <TownNode key={t.id} town={t} active={selected === t.id} onSelect={onSelect} />
        ))}
      </svg>
    </div>
  );
}

function TownNode({
  town,
  active,
  onSelect,
}: {
  town: ShoreTown;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const tower = town.kind === "tower";
  const fill = active ? "var(--color-brass)" : "var(--color-elevated)";
  const stroke = active ? "var(--color-paper)" : "var(--color-brass)";
  const dir = town.label ?? "top";
  const labelX = dir === "left" ? town.x - town.r - 8 : dir === "right" ? town.x + town.r + 8 : town.x;
  const labelY =
    dir === "top" ? town.y - town.r - 8 : dir === "bottom" ? town.y + town.r + 16 : town.y + 4;
  const anchor = dir === "left" ? "end" : dir === "right" ? "start" : "middle";

  return (
    <g
      className="cursor-pointer"
      onClick={() => onSelect(town.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(town.id);
        }
      }}
      aria-label={`${town.name}, ${town.county}`}
    >
      <circle cx={town.x} cy={town.y} r={town.r + 12} fill="transparent" />
      {tower ? (
        <rect
          x={town.x - town.r}
          y={town.y - town.r * 1.6}
          width={town.r * 2}
          height={town.r * 3.2}
          fill={fill}
          stroke={stroke}
          strokeWidth={active ? 2 : 1.25}
        />
      ) : (
        <circle
          cx={town.x}
          cy={town.y}
          r={town.r}
          fill={fill}
          stroke={stroke}
          strokeWidth={active ? 2 : 1.25}
        />
      )}
      <text
        x={labelX}
        y={labelY}
        textAnchor={anchor}
        fill={active ? "var(--color-paper)" : "var(--color-steel)"}
        fontSize={tower ? 11 : town.r >= 18 ? 14 : 12}
        fontFamily="var(--font-display)"
      >
        {town.name}
      </text>
    </g>
  );
}
