import { useNavigate } from "@tanstack/react-router";
import { ATLAS_LONG_ISLAND } from "@/data/island";
import { SHORE_TOWNS, type ShoreTown } from "@/data/shore";
import { cn } from "@/lib/utils";

export function ShoreMap({
  selected,
  onSelect,
  onIsland,
  onNewYork,
  onBay,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  onIsland: () => void;
  onNewYork: () => void;
  onBay: () => void;
}) {
  const navigate = useNavigate();
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
          d="M 0 0 L 1100 0 L 1100 332 L 980 338 L 900 328 L 840 362 L 800 308 L 770 306 L 740 368 L 680 348 L 600 340 L 548 368 L 510 350 L 478 338 L 430 388 L 400 352 L 348 372 L 318 318 L 288 316 L 268 368 L 220 348 L 160 332 L 100 348 L 0 338 Z"
          fill="var(--color-ink)"
        />

        {/* Housatonic — Shelton to Stratford mouth */}
        <path
          d="M 518 36 C 512 110 506 168 510 230 C 514 290 532 338 548 368"
          fill="none"
          stroke="var(--color-water)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <text x="528" y="200" fill="var(--color-subtle-fg)" fontSize="9" fontFamily="var(--font-sans)" letterSpacing="0.12em">
          HOUSATONIC
        </text>

        <line
          x1="40"
          y1="278"
          x2="1040"
          y2="268"
          stroke="var(--color-steel)"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeDasharray="10 8"
        />
        <text
          x="60"
          y="270"
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
          x2="310"
          y2="310"
          stroke="var(--color-steel)"
          strokeOpacity="0.3"
          strokeWidth="2"
          strokeDasharray="8 7"
        />
        <text
          x="430"
          y="150"
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
        <text
          x="700"
          y="318"
          fill="var(--color-paper)"
          fillOpacity="0.28"
          fontSize="10"
          fontFamily="var(--font-display)"
        >
          New Haven Harbor
        </text>
        <text
          x="250"
          y="390"
          fill="var(--color-paper)"
          fillOpacity="0.28"
          fontSize="10"
          fontFamily="var(--font-display)"
        >
          Bridgeport Harbor
        </text>

        {/* Long Island north shore — existing south edge, no extra land south of the chart */}
        <path
          d="M 0 640 L 1100 640 L 1100 598 C 980 608 860 590 740 604 C 620 618 520 588 400 602 C 280 616 160 590 80 604 C 40 610 0 598 0 598 Z"
          fill="var(--color-ink)"
        />
        <text
          x="40"
          y="590"
          fill="var(--color-paper)"
          fillOpacity="0.7"
          fontSize="11"
          fontFamily="var(--font-sans)"
          letterSpacing="0.22em"
        >
          LONG ISLAND · NORTH SHORE
        </text>
        {ATLAS_LONG_ISLAND.map((t) => {
          const x = t.inland ? 210 : Math.round(t.x * (1100 / 1792));
          const y = t.inland ? 632 : 614;
          return (
            <g
              key={t.id}
              className="cursor-pointer"
              onClick={() => {
                void navigate({ to: "/", search: { li: t.id } });
              }}
              role="button"
              tabIndex={0}
              aria-label={`${t.name}, Long Island, open island chart`}
            >
              <circle cx={x} cy={y} r={t.inland ? 3.5 : 4} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth={1} />
              <text
                x={t.inland ? x + 8 : x}
                y={t.inland ? y + 4 : y - 8}
                textAnchor={t.inland ? "start" : "middle"}
                fill="var(--color-paper)"
                fontSize={10}
                fontFamily="var(--font-display)"
              >
                {t.name}
              </text>
            </g>
          );
        })}

        <g
          className="cursor-pointer"
          onClick={onIsland}
          role="button"
          tabIndex={0}
          aria-label="Silent Island, open island chart"
        >
          <ellipse cx="330" cy="490" rx="78" ry="32" fill="var(--color-ink)" stroke="var(--color-brass)" strokeWidth="1.5" />
          <ellipse cx="430" cy="478" rx="22" ry="14" fill="var(--color-ink)" stroke="var(--color-brass)" strokeOpacity="0.6" />
          <text
            x="330"
            y="494"
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
            y="418"
            width="168"
            height="56"
            rx="10"
            fill="var(--color-ink)"
            stroke="var(--color-paper)"
            strokeOpacity="0.28"
            strokeDasharray="4 4"
          />
          <text x="32" y="442" fill="var(--color-muted)" fontSize="12" fontFamily="var(--font-display)">
            New York →
          </text>
          <text x="32" y="460" fill="var(--color-subtle-fg)" fontSize="10" fontFamily="var(--font-sans)">
            off this chart
          </text>
        </g>

        <g
          className="cursor-pointer"
          onClick={onBay}
          role="button"
          tabIndex={0}
          aria-label="Narragansett Bay, east of this chart"
        >
          <rect
            x="916"
            y="418"
            width="168"
            height="56"
            rx="10"
            fill="var(--color-ink)"
            stroke="var(--color-brass)"
            strokeOpacity="0.5"
            strokeDasharray="4 4"
          />
          <text x="932" y="442" fill="var(--color-brass)" fontSize="12" fontFamily="var(--font-display)">
            Narragansett Bay →
          </text>
          <text x="932" y="460" fill="var(--color-subtle-fg)" fontSize="10" fontFamily="var(--font-sans)">
            east of the Sound
          </text>
        </g>

        {SHORE_TOWNS.map((t) => (
          <TownNode key={t.id} town={t} active={selected === t.id} onSelect={onSelect} />
        ))}
      </svg>

      <div className="absolute inset-x-0 bottom-14 z-10 border-t border-border bg-ink/95 px-3 py-2 lg:bottom-0">
        <p className="text-[10px] font-medium tracking-widest text-muted uppercase">
          Long Island · North Shore
        </p>
        <div className="mt-1 flex gap-1 overflow-x-auto">
          {ATLAS_LONG_ISLAND.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                void navigate({ to: "/", search: { li: t.id } });
              }}
              className={cn(
                "h-9 shrink-0 rounded-full px-3 text-xs text-paper hover:bg-subtle",
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
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
