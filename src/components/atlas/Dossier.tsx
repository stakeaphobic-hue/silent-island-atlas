import { Link } from "@tanstack/react-router";
import { MapPin, Building2, Landmark, TriangleAlert, Tent, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  COUNTIES,
  OVERVIEW,
  PLACES,
  searchPlaces,
  type CountyId,
  type Place,
  type PlaceKind,
} from "@/data/island";
import { FRONTS, frontById, searchFronts, type Front } from "@/data/fronts";
import { peopleAtPlace, peopleInCounty } from "@/data/place-people";
import { ClockFace } from "@/components/atlas/FrontsMap";
import { cn } from "@/lib/utils";

export type Selection =
  | { type: "overview" }
  | { type: "county"; id: CountyId }
  | { type: "place"; id: string }
  | { type: "front"; id: string };

const KIND_ICON: Record<PlaceKind, typeof MapPin> = {
  county: MapPin,
  city: Landmark,
  town: MapPin,
  megablock: Building2,
  landmark: Landmark,
  wartime: TriangleAlert,
  camp: Tent,
};

export function Dossier({
  selection,
  onSelect,
  onClose,
  query,
  frontsMode,
}: {
  selection: Selection;
  onSelect: (next: Selection) => void;
  onClose?: () => void;
  query: string;
  frontsMode?: boolean;
}) {
  if (frontsMode) {
    return (
      <FrontsDossier selection={selection} onSelect={onSelect} onClose={onClose} query={query} />
    );
  }

  const county =
    selection.type === "county"
      ? COUNTIES.find((c) => c.id === selection.id)
      : selection.type === "place"
        ? COUNTIES.find((c) => c.id === PLACES.find((p) => p.id === selection.id)?.county)
        : undefined;
  const place = selection.type === "place" ? PLACES.find((p) => p.id === selection.id) : undefined;

  const title = place?.name ?? county?.name ?? OVERVIEW.name;
  const summary = place?.summary ?? county?.summary ?? OVERVIEW.summary;
  const body = place?.body ?? county?.body ?? OVERVIEW.body;
  const kind = place?.kind;
  const Icon = kind ? KIND_ICON[kind] : Landmark;

  const related = place
    ? PLACES.filter((p) => p.county === place.county && p.id !== place.id).slice(0, 8)
    : county
      ? PLACES.filter((p) => p.county === county.id && (p.kind === "town" || p.kind === "city" || p.kind === "megablock"))
      : COUNTIES.map((c) => ({ id: c.id, name: c.name, kind: "county" as const, summary: c.summary }));

  const q = query.trim().toLowerCase();
  const hits = q ? searchPlaces(q) : [];

  const people = place
    ? peopleAtPlace(place.id)
    : county
      ? peopleInCounty(county.id)
      : [];

  return (
    <aside className="flex h-full min-h-0 flex-col bg-elevated text-paper shadow-border">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            {place ? county?.name : county ? "County" : "Chart"}
          </p>
          <h2 className="mt-1 font-display text-2xl font-medium leading-tight text-paper">
            {title}
          </h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon-sm" aria-label="Close dossier" onClick={onClose}>
            <X />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
        <span className="inline-flex size-8 items-center justify-center rounded-md bg-subtle text-steel">
          <Icon className="size-4" />
        </span>
        {kind && (
          <Badge variant={kind === "wartime" ? "danger" : kind === "megablock" ? "brass" : "default"}>
            {labelKind(kind)}
          </Badge>
        )}
        {place?.families ? (
          <Badge variant="paper">{place.families.toLocaleString()} families</Badge>
        ) : null}
        {place?.tags?.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      <Separator />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {place?.id === "bwc-da" ? (
          <img
            src="/towers/bwc-da.png"
            alt="BWC DA Tower"
            className="mb-4 aspect-[4/5] w-full max-w-56 rounded-lg object-cover shadow-border"
          />
        ) : null}
        <p className="text-sm leading-relaxed text-steel">{summary}</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{body}</p>

        {place?.id === "bwc-da" && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link to="/shore" search={{ town: "bbc-dvda" }}>
                BBC DVDA · Midtown
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/shore" search={{ town: "bbc-dp" }}>
                BBC DP · Downtown
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/shore" search={{ town: "bwc-dv" }}>
                BWC DV · Waterbury
              </Link>
            </Button>
          </div>
        )}

        {selection.type === "overview" && !q && (
          <section className="mt-6 rounded-xl bg-subtle px-4 py-4">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Character lookup</h3>
            <p className="mt-2 text-sm leading-relaxed text-steel">
              Search a name, faction, or role. Desks for Island, Kindred, Media, Sports, and the rest.
            </p>
            <Button variant="secondary" size="sm" className="mt-3" asChild>
              <Link to="/roster">
                <Users className="size-3.5" />
                Open roster
              </Link>
            </Button>
          </section>
        )}

        {people.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">People</h3>
            <ul className="mt-2 flex flex-col gap-1">
              {people.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/roster"
                    search={{ id: c.id, desk: c.bucket }}
                    className="flex w-full items-start justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-subtle"
                  >
                    <span>
                      <span className="block text-sm text-paper">{c.name}</span>
                      <span className="block text-xs text-muted">{c.role}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hits.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Search</h3>
            <ul className="mt-2 flex flex-col gap-1">
              {hits.map((p) => (
                <PlaceRow key={p.id} place={p} active={place?.id === p.id} onSelect={onSelect} />
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6">
          <h3 className="text-xs font-medium tracking-widest text-muted uppercase">
            {county ? `${county.short} places` : "Counties"}
          </h3>
          <ul className="mt-2 flex flex-col gap-1">
            {selection.type === "overview" && !q
              ? COUNTIES.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onSelect({ type: "county", id: c.id })}
                      className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left hover:bg-subtle"
                    >
                      <span className="mt-1 size-2 shrink-0 rounded-full" style={{ background: countyDot(c.id) }} />
                      <span>
                        <span className="block text-sm text-paper">{c.name}</span>
                        <span className="block text-xs text-muted">{c.summary}</span>
                      </span>
                    </button>
                  </li>
                ))
              : related.map((item) =>
                  "county" in item && "x" in item ? (
                    <PlaceRow
                      key={item.id}
                      place={item as Place}
                      active={false}
                      onSelect={onSelect}
                    />
                  ) : (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onSelect({ type: "county", id: item.id as CountyId })}
                        className="flex w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-subtle"
                      >
                        {item.name}
                      </button>
                    </li>
                  ),
                )}
          </ul>
        </section>
      </div>

      <div className="px-5 py-3 text-xs text-subtle-fg">
        Host towns for unnamed MegaBlocks are atlas placements. Lore locks the counties, not those six names.
      </div>
    </aside>
  );
}

function FrontsDossier({
  selection,
  onSelect,
  onClose,
  query,
}: {
  selection: Selection;
  onSelect: (next: Selection) => void;
  onClose?: () => void;
  query: string;
}) {
  const front = selection.type === "front" ? frontById(selection.id) : undefined;
  const hits = searchFronts(query);

  return (
    <aside className="flex h-full min-h-0 flex-col bg-elevated text-paper shadow-border">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            {front ? front.kind : "Fronts"}
          </p>
          <h2 className="mt-1 font-display text-2xl font-medium leading-tight text-paper">
            {front?.name ?? "Draw maps, leave blanks"}
          </h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon-sm" aria-label="Close dossier" onClick={onClose}>
            <X />
          </Button>
        )}
      </div>

      {front ? (
        <div className="flex flex-wrap items-center gap-3 px-5 pb-4">
          <ClockFace hour={front.clock} blank={front.kind === "blank"} size={44} />
          <div>
            <p className="text-sm text-brass">{front.clockNote}</p>
            <p className="text-xs text-muted">{front.ground}</p>
          </div>
        </div>
      ) : (
        <div className="px-5 pb-4">
          <p className="text-sm leading-relaxed text-steel">
            Situation map. Clocks, impulses, and the empty chairs. Not a street atlas.
          </p>
        </div>
      )}

      <Separator />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {front ? <FrontBody front={front} /> : null}

        {hits.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Search</h3>
            <FrontList fronts={hits} active={front?.id} onSelect={onSelect} />
          </section>
        )}

        <section className="mt-6">
          <h3 className="text-xs font-medium tracking-widest text-muted uppercase">
            {front ? "Other fronts" : "Live storms"}
          </h3>
          <FrontList
            fronts={FRONTS.filter((f) => f.id !== front?.id)}
            active={front?.id}
            onSelect={onSelect}
          />
        </section>
      </div>

      <div className="px-5 py-3 text-xs text-subtle-fg">
        Late August 2026. August and September are empty in the source. Weirding is unseated. NY is unmapped.
      </div>
    </aside>
  );
}

function FrontBody({ front }: { front: Front }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-steel">{front.summary}</p>
      <p className="mt-3 text-sm leading-relaxed text-paper">
        <span className="text-xs tracking-widest text-muted uppercase">Impulse </span>
        {front.impulse}
      </p>
      {front.doom !== "—" && (
        <p className="mt-2 text-sm leading-relaxed text-muted">
          <span className="text-xs tracking-widest text-muted uppercase">Doom </span>
          {front.doom}
        </p>
      )}
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{front.body}</p>

      {front.id === "shore" && (
        <Button variant="secondary" size="sm" className="mt-4" asChild>
          <Link to="/shore">Open shore chart</Link>
        </Button>
      )}

      {front.portents.length > 0 && (
        <section className="mt-5">
          <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Countdown</h3>
          <ol className="mt-2 space-y-2">
            {front.portents.map((p) => (
              <li key={`${p.hour}-${p.text}`} className="flex gap-3 text-sm">
                <span className={cn("shrink-0 tabular-nums text-xs", p.done ? "text-brass" : "text-muted")}>
                  {p.hour}:00
                </span>
                <span className={cn(p.done && "text-steel", p.blank && "text-muted italic", !p.done && !p.blank && "text-paper")}>
                  {p.blank ? `Blank — ${p.text}` : p.text}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {front.blanks.length > 0 && (
        <section className="mt-5 rounded-xl border border-dashed border-border px-3 py-3">
          <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Blanks</h3>
          <ul className="mt-2 space-y-1.5">
            {front.blanks.map((b) => (
              <li key={b} className="text-sm leading-relaxed text-muted">
                {b}
              </li>
            ))}
          </ul>
        </section>
      )}

      {front.cast.length > 0 && (
        <section className="mt-5">
          <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Cast</h3>
          <ul className="mt-2 flex flex-col gap-1">
            {front.cast.map((c) => (
              <li key={c.id}>
                <Link
                  to="/roster"
                  search={{ id: c.id }}
                  className="flex min-h-11 items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-subtle"
                >
                  <span className="text-sm text-paper">{c.name}</span>
                  <span className="text-xs text-muted">{c.role}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function FrontList({
  fronts,
  active,
  onSelect,
}: {
  fronts: Front[];
  active?: string;
  onSelect: (next: Selection) => void;
}) {
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {fronts.map((f) => (
        <li key={f.id}>
          <button
            type="button"
            onClick={() => onSelect({ type: "front", id: f.id })}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-subtle",
              active === f.id && "bg-subtle",
            )}
          >
            <ClockFace hour={f.clock} blank={f.kind === "blank"} size={28} />
            <span className="min-w-0">
              <span className="block truncate text-sm text-paper">{f.name}</span>
              <span className="block truncate text-xs text-muted">{f.impulse}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function PlaceRow({
  place,
  active,
  onSelect,
}: {
  place: Place;
  active: boolean;
  onSelect: (next: Selection) => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect({ type: "place", id: place.id })}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-subtle",
          active && "bg-subtle",
        )}
      >
        <span className="text-sm text-paper">{place.name}</span>
        <span className="text-xs text-muted">{labelKind(place.kind)}</span>
      </button>
    </li>
  );
}

function labelKind(kind: PlaceKind) {
  switch (kind) {
    case "megablock":
      return "MegaBlock";
    case "wartime":
      return "Wartime";
    case "camp":
      return "Camp";
    case "city":
      return "City";
    case "landmark":
      return "Landmark";
    default:
      return "Town";
  }
}

function countyDot(id: CountyId) {
  return `var(--color-${id})`;
}
