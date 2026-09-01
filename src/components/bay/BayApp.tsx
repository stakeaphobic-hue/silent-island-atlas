import { useEffect, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Compass, MapPin, X } from "lucide-react";
import { BayMap } from "@/components/bay/BayMap";
import { AppHeader } from "@/components/shell/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BAY_OVERVIEW, BAY_PLACES, bayPlace, searchBay, type BayPlace } from "@/data/bay";
import { cn } from "@/lib/utils";

type Sel = { type: "overview" } | { type: "place"; id: string };

export function BayApp() {
  const search = useSearch({ from: "/bay" });
  const navigate = useNavigate({ from: "/bay" });
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
        title="Narragansett Bay"
        kicker="West Passage · East Passage · Sakonnet · Rhode Island Sound"
        search={query}
        onSearch={(v) => {
          setQuery(v);
          setMobileOpen(true);
        }}
        searchLabel="Search coasts, islands, lights"
      />

      <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setMobileOpen(true);
          }}
          placeholder="Search coasts, islands, lights"
          aria-label="Search coasts, islands, lights"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2 overflow-x-auto px-4 py-2">
        <p className="text-xs tracking-widest text-muted uppercase">Coastal features · not courts</p>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 lg:right-[22.5rem]">
          <BayMap
            selected={sel.type === "place" ? sel.id : null}
            onSelect={(id) => select({ type: "place", id })}
            onIsland={() => {
              void navigate({ to: "/" });
            }}
            onShore={() => {
              void navigate({ to: "/shore" });
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
              <BayDossier sel={sel} query={query} onSelect={select} onClose={() => select({ type: "overview" })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BayDossier({
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
  const place = sel.type === "place" ? bayPlace(sel.id) : undefined;
  const hits = searchBay(query);
  const title = place?.name ?? BAY_OVERVIEW.name;
  const summary = place?.summary ?? BAY_OVERVIEW.summary;
  const body = place?.body ?? BAY_OVERVIEW.body;
  const byShore = (shore: BayPlace["shore"]) =>
    BAY_PLACES.filter((p) => p.shore === shore && p.id !== place?.id);

  return (
    <aside className="flex h-full min-h-0 flex-col bg-elevated text-paper shadow-border">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            {place ? place.shore : "Bay"}
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
          <Badge variant={place.kind === "city" || place.kind === "island" ? "brass" : "default"}>
            {place.kind}
          </Badge>
        ) : (
          <Badge>Passages · islands</Badge>
        )}
        {place?.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      <Separator />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <p className="text-sm leading-relaxed text-steel">{summary}</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{body}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link to="/shore">The Shore</Link>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link to="/">Silent Island</Link>
          </Button>
        </div>

        {place?.blanks.length ? (
          <section className="mt-5 rounded-xl border border-dashed border-border px-3 py-3">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Blanks</h3>
            <ul className="mt-2 space-y-1.5">
              {place.blanks.map((b) => (
                <li key={b} className="text-sm leading-relaxed text-muted">
                  {b}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {hits.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Search</h3>
            <PlaceList places={hits} active={place?.id} onSelect={onSelect} />
          </section>
        )}

        {(
          [
            ["West Bay", byShore("West Bay")],
            ["East Bay", byShore("East Bay")],
            ["Aquidneck", byShore("Aquidneck")],
            ["Conanicut", byShore("Conanicut")],
            ["Upper Bay", byShore("Upper Bay")],
          ] as const
        ).map(([label, list]) =>
          list.length ? (
            <section key={label} className="mt-6">
              <h3 className="text-xs font-medium tracking-widest text-muted uppercase">{label}</h3>
              <PlaceList places={list} active={place?.id} onSelect={onSelect} />
            </section>
          ) : null,
        )}
      </div>

      <div className="px-5 py-3 text-xs text-subtle-fg">
        East of the Sound. Not Silent Island water. Coastal facts only.
      </div>
    </aside>
  );
}

function PlaceList({
  places,
  active,
  onSelect,
}: {
  places: BayPlace[];
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
              <span className="block text-xs text-muted">{p.kind} · {p.shore}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function selFrom(place?: string): Sel {
  if (place && bayPlace(place)) return { type: "place", id: place };
  return { type: "overview" };
}
