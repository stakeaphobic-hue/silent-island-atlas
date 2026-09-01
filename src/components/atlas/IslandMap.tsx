import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Selection } from "@/components/atlas/Dossier";
import {
  ATLAS_LONG_ISLAND,
  ATLAS_SHORE,
  CONNECTICUT_LAND,
  COUNTESS_PATH,
  COUNTIES,
  COUNTY_SPLITS,
  ISLAND_PATH,
  LONG_ISLAND_LAND,
  MAP_H,
  MAP_W,
  PLACES,
  type CountyId,
  type LayerId,
  type Place,
} from "@/data/island";
import { asset } from "@/lib/utils";

type Props = {
  selection: Selection;
  onSelect: (next: Selection) => void;
  layers: Record<LayerId, boolean>;
};

const COUNTY_FILL: Record<CountyId, string> = {
  weirding: "var(--color-weirding)",
  silent: "var(--color-silent)",
  eerier: "var(--color-eerier)",
  countess: "var(--color-countess)",
};

export function IslandMap({ selection, onSelect, layers }: Props) {
  const navigate = useNavigate();
  const frameRef = useRef<HTMLDivElement>(null);
  const [cam, setCam] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{
    px: number;
    py: number;
    cx: number;
    cy: number;
    id: number;
  } | null>(null);

  const zoomAt = useCallback((clientX: number, clientY: number, factor: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    setCam((c) => {
      const k = Math.min(4.2, Math.max(1, c.k * factor));
      const ratio = k / c.k;
      return {
        k,
        x: mx - (mx - c.x) * ratio,
        y: my - (my - c.y) * ratio,
      };
    });
  }, []);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY > 0 ? 0.9 : 1.12);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    frameRef.current?.setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, cx: cam.x, cy: cam.y, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    setCam((c) => ({
      ...c,
      x: drag.current!.cx + (e.clientX - drag.current!.px),
      y: drag.current!.cy + (e.clientY - drag.current!.py),
    }));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const selectedPlace =
    selection.type === "place" ? PLACES.find((p) => p.id === selection.id) : undefined;
  const selectedCounty = selection.type === "county" ? selection.id : selectedPlace?.county;
  const visible = PLACES.filter((p) => layers[p.layer]);
  const showTownLabels = cam.k > 1.45;

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-ink">
      <div
        ref={frameRef}
        className="absolute inset-0 touch-none overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => {
          setCam({ x: 0, y: 0, k: 1 });
          onSelect({ type: "overview" });
        }}
      >
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.k})`,
            transformOrigin: "0 0",
          }}
        >
          <img
            src={asset("/atlas/island.jpg")}
            alt=""
            draggable={false}
            className="absolute inset-0 size-full object-contain"
          />
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="absolute inset-0 size-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="island-clip">
                <path d={ISLAND_PATH} />
              </clipPath>
            </defs>
            <g clipPath="url(#island-clip)" pointerEvents="none">
              {(Object.keys(COUNTY_SPLITS) as Array<keyof typeof COUNTY_SPLITS>).map((id) => {
                const s = COUNTY_SPLITS[id];
                const active = selectedCounty === id;
                return (
                  <rect
                    key={id}
                    x={s.x}
                    y={220}
                    width={s.w}
                    height={560}
                    fill={COUNTY_FILL[id]}
                    opacity={active ? 0.22 : 0.08}
                  />
                );
              })}
            </g>
            <path
              d={ISLAND_PATH}
              fill="transparent"
              stroke="color-mix(in oklab, var(--color-paper) 22%, transparent)"
              strokeWidth={1.25}
              pointerEvents="none"
            />
            <path
              d={COUNTESS_PATH}
              fill={
                selectedCounty === "countess"
                  ? "color-mix(in oklab, var(--color-countess) 22%, transparent)"
                  : "transparent"
              }
              stroke="color-mix(in oklab, var(--color-brass) 50%, transparent)"
              strokeWidth={1.25}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelect({ type: "county", id: "countess" });
              }}
              onPointerDown={(e) => e.stopPropagation()}
            />
            <path
              d={CONNECTICUT_LAND}
              fill="color-mix(in oklab, var(--color-ink) 8%, transparent)"
              stroke="color-mix(in oklab, var(--color-steel) 55%, transparent)"
              strokeWidth={1.35}
              pointerEvents="none"
            />
            <path
              d={LONG_ISLAND_LAND}
              fill="color-mix(in oklab, var(--color-ink) 8%, transparent)"
              stroke="color-mix(in oklab, var(--color-steel) 55%, transparent)"
              strokeWidth={1.35}
              pointerEvents="none"
            />
            <path
              d="M 40 52 L 1480 48"
              fill="none"
              stroke="color-mix(in oklab, var(--color-steel) 40%, transparent)"
              strokeWidth={1.6}
              strokeDasharray="10 8"
              pointerEvents="none"
            />
            <text
              x={56}
              y={46}
              fill="var(--color-subtle-fg)"
              fontSize={10}
              fontFamily="var(--font-sans)"
              letterSpacing="0.18em"
              className="pointer-events-none"
            >
              I-95
            </text>
            <path
              d="M 760 36 C 800 70 830 100 848 128"
              fill="none"
              stroke="color-mix(in oklab, var(--color-water) 75%, var(--color-ink))"
              strokeWidth={8}
              strokeLinecap="round"
              pointerEvents="none"
            />
            <text
              x={858}
              y={108}
              fill="var(--color-subtle-fg)"
              fontSize={10}
              fontFamily="var(--font-sans)"
              letterSpacing="0.14em"
              className="pointer-events-none"
            >
              HOUSATONIC
            </text>
            <path
              d="M 600 96 C 220 280 190 740 810 930"
              fill="none"
              stroke="color-mix(in oklab, var(--color-brass) 55%, transparent)"
              strokeWidth={1.6}
              strokeDasharray="7 9"
              pointerEvents="none"
            />
            <text
              x={96}
              y={520}
              fill="var(--color-brass)"
              fillOpacity={0.7}
              fontSize={11}
              fontFamily="var(--font-display)"
              className="pointer-events-none"
            >
              Ferry
            </text>
            <text
              x={520}
              y={122}
              fill="var(--color-paper)"
              fillOpacity={0.38}
              fontSize={11}
              fontFamily="var(--font-display)"
              className="pointer-events-none"
            >
              Bridgeport Harbor
            </text>
            <text
              x={1080}
              y={124}
              fill="var(--color-paper)"
              fillOpacity={0.38}
              fontSize={11}
              fontFamily="var(--font-display)"
              className="pointer-events-none"
            >
              New Haven Harbor
            </text>
            <path
              d="M 270 530 C 520 508 740 528 1000 548 C 1140 562 1260 575 1288 555"
              fill="none"
              stroke="color-mix(in oklab, var(--color-steel) 35%, transparent)"
              strokeWidth={1.5}
              strokeDasharray="8 7"
              pointerEvents="none"
            />
            <text
              x={742}
              y={518}
              fill="var(--color-subtle-fg)"
              fontSize={10}
              fontFamily="var(--font-sans)"
              letterSpacing="0.18em"
              className="pointer-events-none"
            >
              RT 69
            </text>
            <text
              x={36}
              y={28}
              fill="var(--color-subtle-fg)"
              fontSize={11}
              fontFamily="var(--font-sans)"
              letterSpacing="0.28em"
              className="pointer-events-none"
            >
              THE SHORE · CONNECTICUT
            </text>
            {ATLAS_SHORE.map((t) => {
              const inland = Boolean(t.inland);
              const tower = t.kind === "tower";
              const city = t.kind === "city";
              const side = t.label ?? (inland || tower ? "right" : "top");
              const lx = side === "left" ? t.x - 8 : side === "right" ? t.x + 8 : t.x;
              const ly = side === "top" ? t.y - 10 : t.y + 4;
              const anchor = side === "left" ? "end" : side === "right" ? "start" : "middle";
              return (
                <g
                  key={t.id}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    void navigate({ to: "/shore", search: { town: t.id } });
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {tower ? (
                    <rect
                      x={t.x - 4}
                      y={t.y - 7}
                      width={8}
                      height={14}
                      fill="var(--color-elevated)"
                      stroke="var(--color-brass)"
                      strokeWidth={1.15}
                    />
                  ) : (
                    <circle
                      cx={t.x}
                      cy={t.y}
                      r={city ? 7 : inland ? 4.5 : 5}
                      fill="var(--color-elevated)"
                      stroke="var(--color-brass)"
                      strokeWidth={1.15}
                    />
                  )}
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={anchor}
                    fill="var(--color-steel)"
                    fontSize={tower ? 10 : 11}
                    fontFamily="var(--font-display)"
                  >
                    {t.name}
                  </text>
                </g>
              );
            })}
            <g
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                void navigate({ to: "/bay" });
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <rect
                x="1520"
                y="18"
                width="248"
                height="44"
                rx="10"
                fill="var(--color-ink)"
                stroke="var(--color-brass)"
                strokeOpacity="0.55"
                strokeDasharray="4 4"
              />
              <text x="1536" y="38" fill="var(--color-brass)" fontSize="13" fontFamily="var(--font-display)">
                Narragansett Bay →
              </text>
              <text x="1536" y="54" fill="var(--color-subtle-fg)" fontSize="10" fontFamily="var(--font-sans)">
                east of this Sound
              </text>
            </g>
            <g clipPath="url(#island-clip)">
              {(
                [
                  ["weirding", COUNTY_SPLITS.weirding],
                  ["silent", COUNTY_SPLITS.silent],
                  ["eerier", COUNTY_SPLITS.eerier],
                ] as const
              ).map(([id, s]) => (
                <rect
                  key={id}
                  x={s.x}
                  y={220}
                  width={s.w}
                  height={560}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect({ type: "county", id });
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                />
              ))}
            </g>
            <text
              x={36}
              y={998}
              fill="var(--color-subtle-fg)"
              fontSize={11}
              fontFamily="var(--font-sans)"
              letterSpacing="0.28em"
              className="pointer-events-none"
            >
              LONG ISLAND · NORTH SHORE
            </text>
            {ATLAS_LONG_ISLAND.map((t) => (
              <g
                key={t.id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect({ type: "li", id: t.id });
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <circle
                  cx={t.x}
                  cy={t.y}
                  r={t.id === "port-jefferson" ? 6 : t.inland ? 4.5 : 5}
                  fill="var(--color-elevated)"
                  stroke="var(--color-brass)"
                  strokeWidth={1.15}
                />
                <text
                  x={t.inland ? t.x + 8 : t.x}
                  y={t.inland ? t.y + 4 : t.y - 12}
                  textAnchor={t.inland ? "start" : "middle"}
                  fill="var(--color-steel)"
                  fontSize={11}
                  fontFamily="var(--font-display)"
                >
                  {t.name}
                </text>
              </g>
            ))}
            {COUNTIES.map((c) => (
              <text
                key={c.id}
                x={c.x}
                y={c.y}
                fill="var(--color-paper)"
                fontSize={c.id === "countess" ? 16 : 20}
                fontFamily="var(--font-display)"
                opacity={0.9}
                className="pointer-events-none"
              >
                {c.name.toUpperCase()}
                {c.id === "countess" ? (
                  <tspan
                    x={c.x}
                    dy="16"
                    fill="var(--color-brass)"
                    fontSize={11}
                    fontFamily="var(--font-sans)"
                    letterSpacing="0.16em"
                    opacity={0.95}
                  >
                    AKA THE GILDED GROVE
                  </tspan>
                ) : null}
              </text>
            ))}
            {(() => {
              const tower = PLACES.find((p) => p.id === "bwc-da");
              if (!tower) return null;
              const selected = selection.type === "place" && selection.id === "bwc-da";
              return (
                <g
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect({ type: "place", id: "bwc-da" });
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <rect
                    x={tower.x + 14}
                    y={tower.y - 86}
                    width={44}
                    height={64}
                    rx={3}
                    fill="var(--color-ink)"
                    stroke={selected ? "var(--color-paper)" : "var(--color-brass)"}
                    strokeWidth={selected ? 1.6 : 1.1}
                  />
                  <image
                    href={asset("/towers/bwc-da.png")}
                    x={tower.x + 16}
                    y={tower.y - 84}
                    width={40}
                    height={60}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>
              );
            })()}
            {visible.map((p) => (
              <Marker
                key={p.id}
                place={p}
                selected={selection.type === "place" && selection.id === p.id}
                showLabel={
                  showTownLabels ||
                  Boolean(p.alwaysLabel) ||
                  (selection.type === "place" && selection.id === p.id)
                }
                onSelect={() => onSelect({ type: "place", id: p.id })}
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ink/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/70 to-transparent" />

      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label="Zoom in"
          onClick={() => {
            const r = frameRef.current?.getBoundingClientRect();
            if (!r) return;
            zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1.2);
          }}
        >
          <Plus />
        </Button>
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label="Zoom out"
          onClick={() => {
            const r = frameRef.current?.getBoundingClientRect();
            if (!r) return;
            zoomAt(r.left + r.width / 2, r.top + r.height / 2, 0.84);
          }}
        >
          <Minus />
        </Button>
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label="Reset view"
          onClick={() => setCam({ x: 0, y: 0, k: 1 })}
        >
          <LocateFixed />
        </Button>
      </div>

      <p className="absolute bottom-3 left-3 max-w-[13rem] rounded-xl bg-elevated/90 px-3 py-2 text-xs text-muted shadow-border">
        Drag to pan. Scroll to zoom. Click a town.
      </p>
    </div>
  );
}

function Marker({
  place,
  selected,
  showLabel,
  onSelect,
}: {
  place: Place;
  selected: boolean;
  showLabel: boolean;
  onSelect: () => void;
}) {
  const callout = place.labelX != null && place.labelY != null;
  const r =
    place.county === "countess"
      ? 3.2
      : place.kind === "city"
        ? 8
        : place.kind === "megablock"
          ? 5.5
          : 4.8;
  const fill =
    place.kind === "wartime"
      ? "var(--color-danger)"
      : place.kind === "camp"
        ? "var(--color-eerier)"
        : place.kind === "megablock"
          ? "var(--color-brass)"
          : place.kind === "city" || place.kind === "landmark"
            ? "var(--color-paper)"
            : COUNTY_FILL[place.county];
  const lx = callout ? place.labelX! : place.x + r + 5;
  const ly = callout ? place.labelY! : place.y + 4;

  return (
    <g
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {callout && showLabel ? (
        <line
          x1={place.x}
          y1={place.y}
          x2={lx}
          y2={ly}
          stroke="color-mix(in oklab, var(--color-paper) 45%, transparent)"
          strokeWidth={1}
        />
      ) : null}
      {selected && (
        <circle
          cx={place.x}
          cy={place.y}
          r={r + 9}
          fill="none"
          stroke="var(--color-paper)"
          strokeWidth={1.2}
        />
      )}
      {place.kind === "megablock" ? (
        <rect
          x={place.x - r}
          y={place.y - r * 1.5}
          width={r * 2}
          height={r * 3}
          fill={fill}
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
      ) : (
        <circle
          cx={place.x}
          cy={place.y}
          r={r}
          fill={fill}
          stroke="var(--color-ink)"
          strokeWidth={1.15}
        />
      )}
      {showLabel && (
        <text
          x={lx}
          y={ly}
          fill="var(--color-paper)"
          fontSize={place.alwaysLabel ? 13 : 11}
          fontFamily="var(--font-sans)"
          paintOrder="stroke"
          stroke="var(--color-ink)"
          strokeWidth={3}
        >
          {place.name}
        </text>
      )}
    </g>
  );
}
