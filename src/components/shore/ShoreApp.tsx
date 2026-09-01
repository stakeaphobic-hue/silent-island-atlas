import { useEffect, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Compass, MapPin, X } from "lucide-react";
import { ShoreMap } from "@/components/shore/ShoreMap";
import { AppHeader } from "@/components/shell/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SHORE_OFFMAP,
  SHORE_OVERVIEW,
  SHORE_TOWNS,
  searchShore,
  shoreChildren,
  shoreTown,
  type ShoreTown,
} from "@/data/shore";
import { cn, asset } from "@/lib/utils";

type Sel = { type: "overview" } | { type: "town"; id: string } | { type: "new-york" };

export function ShoreApp() {
  const search = useSearch({ from: "/shore" });
  const navigate = useNavigate({ from: "/shore" });
  const [sel, setSel] = useState<Sel>(selFrom(search.town));
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(Boolean(search.town));

  useEffect(() => {
    setSel(selFrom(search.town));
    if (search.town) setMobileOpen(true);
  }, [search.town]);

  function select(next: Sel) {
    setSel(next);
    setMobileOpen(true);
    if (next.type === "town") {
      void navigate({ search: { town: next.id }, replace: true });
    } else if (next.type === "new-york") {
      void navigate({ search: { town: "new-york" }, replace: true });
    } else {
      void navigate({ search: {}, replace: true });
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-ink text-paper">
      <AppHeader
        title="Shore Atlas"
        kicker="East Fairfield · Waterbury · New Haven · the Sound"
        search={query}
        onSearch={(v) => {
          setQuery(v);
          setMobileOpen(true);
        }}
        searchLabel="Search towns and towers"
      />

      <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setMobileOpen(true);
          }}
          placeholder="Search towns and towers"
          aria-label="Search towns and towers"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2 overflow-x-auto px-4 py-2">
        <p className="text-xs tracking-widest text-muted uppercase">Municipalities · towers · not courts</p>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 lg:right-[22.5rem]">
          <ShoreMap
            selected={sel.type === "town" ? sel.id : sel.type === "new-york" ? "new-york" : null}
            onSelect={(id) => select({ type: "town", id })}
            onIsland={() => {
              void navigate({ to: "/" });
            }}
            onNewYork={() => select({ type: "new-york" })}
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
              <ShoreDossier
                sel={sel}
                query={query}
                onSelect={select}
                onClose={() => select({ type: "overview" })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoreDossier({
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
  const town = sel.type === "town" ? shoreTown(sel.id) : undefined;
  const ny = sel.type === "new-york";
  const hits = searchShore(query);
  const kids = town ? shoreChildren(town.id) : [];
  const parent = town?.parent ? shoreTown(town.parent) : undefined;
  const title = ny ? SHORE_OFFMAP.name : town?.name ?? SHORE_OVERVIEW.name;
  const summary = ny ? SHORE_OFFMAP.summary : town?.summary ?? SHORE_OVERVIEW.summary;
  const body = ny ? SHORE_OFFMAP.body : town?.body ?? SHORE_OVERVIEW.body;
  const municipalities = SHORE_TOWNS.filter((t) => t.kind !== "tower");
  const towers = SHORE_TOWNS.filter((t) => t.kind === "tower");

  return (
    <aside className="flex h-full min-h-0 flex-col bg-elevated text-paper shadow-border">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            {ny ? "Off-map" : town ? town.county : "Shore"}
          </p>
          <h2 className="mt-1 font-display text-2xl font-medium leading-tight">{title}</h2>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Close dossier" onClick={onClose}>
          <X />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
        <span className="inline-flex size-8 items-center justify-center rounded-md bg-subtle text-steel">
          {ny ? <Compass className="size-4" /> : <MapPin className="size-4" />}
        </span>
        {town ? (
          <Badge variant={town.kind === "tower" || town.kind === "city" ? "brass" : "default"}>
            {town.kind}
          </Badge>
        ) : ny ? (
          <Badge>Direction</Badge>
        ) : (
          <Badge>Towns · towers</Badge>
        )}
        {town?.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      <Separator />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {town?.image ? (
          <img
            src={asset(town.image)}
            alt={town.name}
            className="mb-4 aspect-[4/5] w-full max-w-56 rounded-lg object-cover shadow-border"
          />
        ) : null}
        <p className="text-sm leading-relaxed text-steel">{summary}</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{body}</p>

        {parent ? (
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => onSelect({ type: "town", id: parent.id })}>
            {parent.name}
          </Button>
        ) : null}

        {kids.length > 0 && (
          <section className="mt-5">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Needles</h3>
            <TownList towns={kids} active={town?.id} onSelect={onSelect} />
          </section>
        )}

        {town?.kind === "tower" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {town.id !== "bbc-dvda" ? (
              <Button variant="secondary" size="sm" onClick={() => onSelect({ type: "town", id: "bbc-dvda" })}>
                BBC DVDA · Midtown
              </Button>
            ) : null}
            {town.id !== "bbc-dp" ? (
              <Button variant="secondary" size="sm" onClick={() => onSelect({ type: "town", id: "bbc-dp" })}>
                BBC DP · Downtown
              </Button>
            ) : null}
            {town.id !== "bwc-dv" ? (
              <Button variant="secondary" size="sm" onClick={() => onSelect({ type: "town", id: "bwc-dv" })}>
                BWC DV · Waterbury
              </Button>
            ) : null}
            <Button variant="secondary" size="sm" asChild>
              <Link to="/" search={{ place: "bwc-da" }}>
                BWC DA · island
              </Link>
            </Button>
          </div>
        )}

        {town?.people.length ? (
          <section className="mt-5">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">On file</h3>
            <ul className="mt-2 flex flex-col gap-1">
              {town.people.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/roster"
                    search={{ id: p.id }}
                    className="flex min-h-11 items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-subtle"
                  >
                    <span className="text-sm text-paper">{p.name}</span>
                    <span className="text-xs text-muted">{p.role}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {town ? (
          <Button variant="secondary" size="sm" className="mt-4" asChild>
            <Link to="/roster" search={{ q: town.name }}>
              Search roster for {town.name}
            </Link>
          </Button>
        ) : null}

        {town?.blanks.length ? (
          <section className="mt-5 rounded-xl border border-dashed border-border px-3 py-3">
            <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Blanks</h3>
            <ul className="mt-2 space-y-1.5">
              {town.blanks.map((b) => (
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
            <TownList towns={hits} active={town?.id} onSelect={onSelect} />
          </section>
        )}

        <section className="mt-6">
          <h3 className="text-xs font-medium tracking-widest text-muted uppercase">
            {town || ny ? "Other towns" : "Towns"}
          </h3>
          <TownList
            towns={municipalities.filter((t) => t.id !== town?.id)}
            active={town?.id}
            onSelect={onSelect}
          />
        </section>

        <section className="mt-6">
          <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Towers</h3>
          <TownList
            towns={towers.filter((t) => t.id !== town?.id)}
            active={town?.id}
            onSelect={onSelect}
          />
        </section>
      </div>

      <div className="px-5 py-3 text-xs text-subtle-fg">
        BBC DA is Digital Arts — same Midtown HQ as DVDA. BWC DV is Waterbury. BWC DA is the island.
      </div>
    </aside>
  );
}

function TownList({
  towns,
  active,
  onSelect,
}: {
  towns: ShoreTown[];
  active?: string;
  onSelect: (next: Sel) => void;
}) {
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {towns.map((t) => (
        <li key={t.id}>
          <button
            type="button"
            onClick={() => onSelect({ type: "town", id: t.id })}
            className={cn(
              "flex min-h-11 w-full items-start gap-2 rounded-lg px-2 py-2 text-left hover:bg-subtle",
              active === t.id && "bg-subtle",
            )}
          >
            <span className="min-w-0">
              <span className="block text-sm text-paper">{t.name}</span>
              <span className="block text-xs text-muted">{t.county}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function selFrom(town?: string): Sel {
  if (town === "new-york") return { type: "new-york" };
  if (town === "bbc-da") return { type: "town", id: "bbc-dvda" };
  if (town && shoreTown(town)) return { type: "town", id: shoreTown(town)!.id };
  return { type: "overview" };
}
