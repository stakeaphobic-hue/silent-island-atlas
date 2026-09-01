import { useEffect, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Compass, MapPin, X } from "lucide-react";
import { CityMap } from "@/components/city/CityMap";
import { AppHeader } from "@/components/shell/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CITY_OVERVIEW, CITY_PLACES, cityPlace, searchCity, type CityPlace, type CityRing } from "@/data/city";
import { peopleAtPlace } from "@/data/place-people";
import { cn, asset } from "@/lib/utils";

type Sel = { type: "overview" } | { type: "place"; id: string };

const RINGS: Array<[string, CityRing]> = [
  ["Downtown", "downtown"],
  ["South wards", "south"],
  ["West gates", "west"],
  ["North gates", "north"],
  ["East gates", "east"],
  ["ST blanks", "template"],
];

export function CityApp() {
  const search = useSearch({ from: "/city" });
  const navigate = useNavigate({ from: "/city" });
  const [sel, setSel] = useState<Sel>(selFrom(search.place));
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(Boolean(search.place));

  useEffect(() => {
    setSel(selFrom(search.place));
    if (search.place) setMobileOpen(true);
  }, [search.place]);

  function select(next: Sel) {
    setSel(next);
    setMobileOpen(true);
    void navigate({
      search: next.type === "place" ? { place: next.id } : {},
      replace: true,
    });
  }

  return (
    <div className="flex h-dvh flex-col bg-ink text-paper">
      <AppHeader
        title="Silent City"
        kicker="Downtown · MegaBlock · gate towns · Route 69"
        search={query}
        onSearch={(v) => {
          setQuery(v);
          setMobileOpen(true);
        }}
        searchLabel="Search wards, towers, blanks"
      />

      <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setMobileOpen(true);
          }}
          placeholder="Search Silent City"
          aria-label="Search Silent City"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2 overflow-x-auto px-4 py-2">
        <p className="text-xs tracking-widest text-muted uppercase">Metro from the packet · dashed pins are blanks</p>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 lg:right-[22.5rem]">
          <CityMap
            selected={sel.type === "place" ? sel.id : null}
            onSelect={(id) => select({ type: "place", id })}
            onIsland={() => {
              void navigate({ to: "/", search: { place: "silent-city" } });
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 max-h-[70%] lg:pointer-events-auto lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-[22.5rem]">
          <div
            className={cn(
              "pointer-events-auto h-full overflow-hidden rounded-t-2xl lg:rounded-none",
              !mobileOpen && "max-h-14 lg:max-h-none",
            )}
          >
            <button
              type="button"
              className="flex h-14 w-full items-center justify-center bg-elevated text-xs tracking-widest text-muted uppercase lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? "Hide dossier" : "Dossier"}
            </button>
            <div className={cn("h-[min(70dvh,32rem)] lg:h-full", !mobileOpen && "hidden lg:block")}>
              <CityDossier sel={sel} query={query} onSelect={select} onClose={() => select({ type: "overview" })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CityDossier({
  sel,
  query,
  onSelect,
  onClose,
}: {
  sel: Sel;
  query: string;
  onSelect: (next: Sel) => void;
  onClose: () => void;
}) {
  const place = sel.type === "place" ? cityPlace(sel.id) : undefined;
  const hits = searchCity(query);
  const title = place?.name ?? CITY_OVERVIEW.name;
  const summary = place?.summary ?? CITY_OVERVIEW.summary;
  const body = place?.body ?? CITY_OVERVIEW.body;
  const people = peopleAtPlace("silent-city");
  const showPeople = !place || place.id === "downtown" || place.id === "bwc-da";

  return (
    <aside className="flex h-full min-h-0 flex-col bg-elevated text-paper shadow-border">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            {place ? (place.open ? "Blank" : place.ring) : "Silent City"}
          </p>
          <h2 className="mt-1 font-display text-2xl font-medium leading-tight">{title}</h2>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Close dossier" onClick={onClose}>
          <X />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
        <span className="inline-flex size-8 items-center justify-center rounded-md bg-subtle text-steel">
          {place ? <MapPin className="size-4" /> : <Compass className="size-4" />}
        </span>
        {place ? (
          <Badge variant={place.kind === "tower" || place.kind === "city" ? "brass" : "default"}>
            {place.kind}
          </Badge>
        ) : (
          <Badge>Metro</Badge>
        )}
        {place?.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      <Separator />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {place?.id === "bwc-da" || place?.id === "downtown" || !place ? (
          <img
            src={asset("/towers/bwc-da.png")}
            alt="BWC DA Tower"
            className="mb-4 aspect-[4/5] w-full max-w-56 rounded-lg object-cover shadow-border"
          />
        ) : null}
        <p className="text-sm leading-relaxed text-steel">{summary}</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{body}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link to="/" search={{ place: place?.islandPlace ?? "silent-city" }}>
              Island pin
            </Link>
          </Button>
          {place?.id === "bwc-da" ? (
            <Button variant="secondary" size="sm" asChild>
              <Link to="/shore" search={{ town: "bbc-dvda" }}>
                BBC · Bridgeport
              </Link>
            </Button>
          ) : null}
        </div>

        {place?.open ? (
          <section className="mt-5 rounded-xl border border-dashed border-border px-3 py-3">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Fill this</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Name, who holds it, and whether it is still here next session. Packet fact stops at the dashed pin.
            </p>
          </section>
        ) : null}

        {showPeople && people.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">On this ground</h3>
            <ul className="mt-2 space-y-1">
              {people.slice(0, 8).map((p) => (
                <li key={p.id} className="text-sm text-paper">
                  {p.name}
                  <span className="text-muted"> · {p.role}</span>
                </li>
              ))}
            </ul>
            {people.length > 8 ? (
              <Button variant="secondary" size="sm" className="mt-2" asChild>
                <Link to="/roster" search={{ q: "Silent City" }}>
                  All {people.length} on roster
                </Link>
              </Button>
            ) : null}
          </section>
        )}

        {hits.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Search</h3>
            <PlaceList places={hits} active={place?.id} onSelect={onSelect} />
          </section>
        )}

        {RINGS.map(([label, ring]) => {
          const list = CITY_PLACES.filter((p) => p.ring === ring && p.id !== place?.id);
          if (!list.length) return null;
          return (
            <section key={ring} className="mt-6">
              <h3 className="text-xs font-medium tracking-widest text-muted uppercase">{label}</h3>
              <PlaceList places={list} active={place?.id} onSelect={onSelect} />
            </section>
          );
        })}
      </div>

      <div className="px-5 py-3 text-xs text-subtle-fg">No street grid in the packet. Dashed pins are yours.</div>
    </aside>
  );
}

function PlaceList({
  places,
  active,
  onSelect,
}: {
  places: CityPlace[];
  active?: string;
  onSelect: (next: Sel) => void;
}) {
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {places.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            onClick={() => onSelect({ type: "place", id: p.id })}
            className={cn(
              "flex min-h-11 w-full items-start gap-2 rounded-lg px-2 py-2 text-left hover:bg-subtle",
              active === p.id && "bg-subtle",
            )}
          >
            <span className="min-w-0">
              <span className="block text-sm text-paper">{p.name}</span>
              <span className="block text-xs text-muted">
                {p.open ? "blank" : p.kind} · {p.ring}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function selFrom(place?: string): Sel {
  if (place && cityPlace(place)) return { type: "place", id: place };
  return { type: "overview" };
}
