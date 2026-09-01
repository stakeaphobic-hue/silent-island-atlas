import { BAY_PLACES, type BayPlace } from "@/data/bay";

export function BayMap({
  selected,
  onSelect,
  onIsland,
  onShore,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  onIsland: () => void;
  onShore: () => void;
}) {
  return (
    <div className="relative h-full min-h-0 bg-water">
      <svg
        viewBox="0 0 1200 780"
        className="h-full w-full"
        role="img"
        aria-label="Narragansett Bay: West Passage, East Passage, Sakonnet River, Aquidneck and Conanicut."
      >
        <rect width="1200" height="780" fill="var(--color-water)" />

        {/* West mainland — Warwick, NK, Narragansett, Point Judith */}
        <path
          d="M 0 0 L 430 0 L 418 70 L 390 120 L 405 155 L 438 198 L 400 214 L 372 236 L 424 258 L 368 278 L 312 292 L 268 318 L 292 348 L 378 366 L 312 386 L 252 408 L 268 432 L 228 458 L 198 508 L 188 560 L 210 628 L 168 688 L 148 738 L 0 738 Z"
          fill="var(--color-ink)"
        />

        {/* East mainland — East Prov, Barrington, Warren, Bristol, Tiverton, Little Compton */}
        <path
          d="M 1200 0 L 545 0 L 538 72 L 568 118 L 612 152 L 598 178 L 652 206 L 688 248 L 658 286 L 702 318 L 678 352 L 748 368 L 812 358 L 838 412 L 818 478 L 848 548 L 918 612 L 978 668 L 1032 738 L 1200 738 Z"
          fill="var(--color-ink)"
        />

        {/* Aquidneck Island */}
        <path
          d="M 708 392 C 738 398 772 418 792 458 C 808 502 802 548 778 598 C 758 638 728 662 692 658 C 668 638 652 612 662 588 C 672 568 698 558 704 538 C 712 508 718 458 708 392 Z"
          fill="var(--color-ink)"
        />

        {/* Conanicut Island */}
        <path
          d="M 404 428 C 438 438 458 478 454 528 C 450 578 438 618 414 642 C 392 628 386 588 394 538 C 384 492 388 448 404 428 Z"
          fill="var(--color-ink)"
        />

        {/* Prudence */}
        <path
          d="M 498 248 C 528 258 542 298 536 348 C 528 388 510 408 492 398 C 478 348 482 288 498 248 Z"
          fill="var(--color-ink)"
        />

        {/* Patience */}
        <ellipse cx="468" cy="272" rx="20" ry="13" fill="var(--color-ink)" />
        {/* Goat */}
        <ellipse cx="678" cy="558" rx="11" ry="7" fill="var(--color-ink)" />
        {/* Rose */}
        <ellipse cx="548" cy="548" rx="12" ry="8" fill="var(--color-ink)" />
        {/* Dutch */}
        <ellipse cx="348" cy="568" rx="11" ry="8" fill="var(--color-ink)" />

        {/* Bridges */}
        <line x1="300" y1="438" x2="404" y2="458" stroke="var(--color-brass)" strokeWidth="2.2" />
        <line x1="454" y1="528" x2="698" y2="538" stroke="var(--color-brass)" strokeWidth="2.4" />
        <line x1="698" y1="338" x2="738" y2="400" stroke="var(--color-brass)" strokeWidth="2.2" />
        <line x1="812" y1="390" x2="768" y2="412" stroke="var(--color-brass)" strokeWidth="2.2" />

        <text x="318" y="432" fill="var(--color-subtle-fg)" fontSize="9" fontFamily="var(--font-sans)">
          Jamestown Br.
        </text>
        <text x="530" y="522" fill="var(--color-subtle-fg)" fontSize="9" fontFamily="var(--font-sans)">
          Pell Bridge
        </text>
        <text x="708" y="368" fill="var(--color-subtle-fg)" fontSize="9" fontFamily="var(--font-sans)">
          Mt Hope Br.
        </text>

        {/* Water names */}
        <text
          x="36"
          y="28"
          fill="var(--color-subtle-fg)"
          fontSize="11"
          fontFamily="var(--font-sans)"
          letterSpacing="0.22em"
        >
          NARRAGANSETT BAY · RHODE ISLAND
        </text>
        <text x="430" y="130" fill="var(--color-paper)" fillOpacity="0.32" fontSize="11" fontFamily="var(--font-display)">
          Providence River
        </text>
        <text x="488" y="430" fill="var(--color-paper)" fillOpacity="0.4" fontSize="13" fontFamily="var(--font-display)">
          Narragansett Bay
        </text>
        <text x="300" y="500" fill="var(--color-paper)" fillOpacity="0.3" fontSize="11" fontFamily="var(--font-display)">
          West Passage
        </text>
        <text x="560" y="500" fill="var(--color-paper)" fillOpacity="0.3" fontSize="11" fontFamily="var(--font-display)">
          East Passage
        </text>
        <text x="830" y="500" fill="var(--color-paper)" fillOpacity="0.3" fontSize="11" fontFamily="var(--font-display)">
          Sakonnet River
        </text>
        <text x="780" y="300" fill="var(--color-paper)" fillOpacity="0.28" fontSize="11" fontFamily="var(--font-display)">
          Mount Hope Bay
        </text>
        <text x="300" y="300" fill="var(--color-paper)" fillOpacity="0.28" fontSize="11" fontFamily="var(--font-display)">
          Greenwich Bay
        </text>
        <text
          x="360"
          y="760"
          fill="var(--color-paper)"
          fillOpacity="0.38"
          fontSize="13"
          fontFamily="var(--font-display)"
        >
          Rhode Island Sound
        </text>

        <g
          className="cursor-pointer"
          onClick={onShore}
          role="button"
          tabIndex={0}
          aria-label="The Shore, Long Island Sound, west of this chart"
        >
          <rect x="16" y="56" width="168" height="48" rx="10" fill="var(--color-elevated)" stroke="var(--color-brass)" strokeOpacity="0.5" />
          <text x="32" y="76" fill="var(--color-muted)" fontSize="12" fontFamily="var(--font-display)">
            ← The Shore
          </text>
          <text x="32" y="92" fill="var(--color-subtle-fg)" fontSize="10" fontFamily="var(--font-sans)">
            Long Island Sound
          </text>
        </g>

        <g
          className="cursor-pointer"
          onClick={onIsland}
          role="button"
          tabIndex={0}
          aria-label="Silent Island, off this chart"
        >
          <rect x="16" y="112" width="168" height="40" rx="10" fill="var(--color-ink)" stroke="var(--color-brass)" strokeOpacity="0.4" strokeDasharray="4 4" />
          <text x="32" y="136" fill="var(--color-brass)" fontSize="11" fontFamily="var(--font-sans)">
            Silent Island →
          </text>
        </g>

        {BAY_PLACES.map((p) => (
          <PlaceNode key={p.id} place={p} active={selected === p.id} onSelect={onSelect} />
        ))}
      </svg>
    </div>
  );
}

function PlaceNode({
  place,
  active,
  onSelect,
}: {
  place: BayPlace;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const fill = active ? "var(--color-brass)" : "var(--color-elevated)";
  const stroke = active ? "var(--color-paper)" : "var(--color-brass)";
  const dir = place.label ?? "top";
  const labelX = dir === "left" ? place.x - place.r - 7 : dir === "right" ? place.x + place.r + 7 : place.x;
  const labelY =
    dir === "top" ? place.y - place.r - 7 : dir === "bottom" ? place.y + place.r + 14 : place.y + 4;
  const anchor = dir === "left" ? "end" : dir === "right" ? "start" : "middle";

  return (
    <g
      className="cursor-pointer"
      onClick={() => onSelect(place.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(place.id);
        }
      }}
      aria-label={`${place.name}, ${place.shore}`}
    >
      <circle cx={place.x} cy={place.y} r={place.r + 10} fill="transparent" />
      {place.kind === "point" ? (
        <polygon
          points={`${place.x},${place.y - place.r} ${place.x + place.r},${place.y} ${place.x},${place.y + place.r} ${place.x - place.r},${place.y}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={active ? 2 : 1.2}
        />
      ) : place.kind === "island" ? (
        <rect
          x={place.x - place.r}
          y={place.y - place.r}
          width={place.r * 2}
          height={place.r * 2}
          rx={2}
          fill={fill}
          stroke={stroke}
          strokeWidth={active ? 2 : 1.2}
        />
      ) : (
        <circle
          cx={place.x}
          cy={place.y}
          r={place.r}
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
        fontSize={place.r >= 14 ? 13 : 11}
        fontFamily="var(--font-display)"
      >
        {place.name}
      </text>
    </g>
  );
}
