import { CITY_PLACES, type CityPlace } from "@/data/city";
import { asset } from "@/lib/utils";

export function CityMap({
  selected,
  onSelect,
  onIsland,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  onIsland: () => void;
}) {
  return (
    <div className="relative h-full min-h-0 bg-ink">
      <svg viewBox="0 0 1100 640" className="size-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <rect width="1100" height="640" fill="var(--color-ink)" />
        <ellipse cx="540" cy="300" rx="210" ry="150" fill="var(--color-silent)" fillOpacity="0.18" />
        <ellipse cx="540" cy="300" rx="210" ry="150" fill="none" stroke="var(--color-steel)" strokeOpacity="0.25" />
        <text
          x="540"
          y="168"
          textAnchor="middle"
          fill="var(--color-paper)"
          fillOpacity="0.35"
          fontSize="13"
          fontFamily="var(--font-sans)"
          letterSpacing="0.28em"
        >
          SILENT CITY · FOG CORE
        </text>

        <path
          d="M 40 300 L 1060 300"
          fill="none"
          stroke="color-mix(in oklab, var(--color-steel) 40%, transparent)"
          strokeWidth="1.6"
          strokeDasharray="10 8"
        />
        <text x="48" y="288" fill="var(--color-subtle-fg)" fontSize="10" fontFamily="var(--font-sans)" letterSpacing="0.18em">
          RT 69
        </text>

        <g className="cursor-pointer" onClick={onIsland} role="button" tabIndex={0} aria-label="Silent Island chart">
          <rect
            x="24"
            y="24"
            width="168"
            height="44"
            rx="10"
            fill="var(--color-ink)"
            stroke="var(--color-brass)"
            strokeOpacity="0.55"
            strokeDasharray="4 4"
          />
          <text x="40" y="44" fill="var(--color-brass)" fontSize="12" fontFamily="var(--font-display)">
            Silent Island →
          </text>
          <text x="40" y="58" fill="var(--color-subtle-fg)" fontSize="10" fontFamily="var(--font-sans)">
            county chart
          </text>
        </g>

        <g className="pointer-events-none">
          <rect
            x="520"
            y="118"
            width="44"
            height="64"
            rx="3"
            fill="var(--color-ink)"
            stroke="var(--color-brass)"
            strokeWidth="1.1"
          />
          <image
            href={asset("/towers/bwc-da.png")}
            x="522"
            y="120"
            width="40"
            height="60"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>

        {CITY_PLACES.map((p) => (
          <Site key={p.id} place={p} active={selected === p.id} onSelect={onSelect} />
        ))}
      </svg>
    </div>
  );
}

function Site({
  place,
  active,
  onSelect,
}: {
  place: CityPlace;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const r = place.r ?? (place.kind === "town" ? 5 : 4.5);
  const fill = active
    ? "var(--color-brass)"
    : place.kind === "megablock"
      ? "var(--color-brass)"
      : place.kind === "open"
        ? "transparent"
        : "var(--color-elevated)";
  const stroke = active ? "var(--color-paper)" : place.kind === "open" ? "var(--color-steel)" : "var(--color-brass)";
  const labelY = place.kind === "tower" ? place.y - 12 : place.y + r + 12;

  return (
    <g
      className="cursor-pointer"
      onClick={() => onSelect(place.id)}
      role="button"
      tabIndex={0}
      aria-label={place.name}
    >
      {place.kind === "megablock" ? (
        <rect
          x={place.x - r}
          y={place.y - r * 1.5}
          width={r * 2}
          height={r * 3}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.15}
        />
      ) : place.kind === "tower" ? (
        <rect
          x={place.x - 4}
          y={place.y - 8}
          width={8}
          height={16}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.15}
        />
      ) : (
        <circle
          cx={place.x}
          cy={place.y}
          r={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.15}
          strokeDasharray={place.open ? "3 3" : undefined}
        />
      )}
      <text
        x={place.x}
        y={labelY}
        textAnchor="middle"
        fill={place.open ? "var(--color-subtle-fg)" : "var(--color-steel)"}
        fontSize={11}
        fontFamily="var(--font-display)"
      >
        {place.name}
      </text>
    </g>
  );
}
