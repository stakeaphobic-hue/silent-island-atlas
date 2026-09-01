import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { IslandMap } from "@/components/atlas/IslandMap";
import { FrontsMap } from "@/components/atlas/FrontsMap";
import { Dossier, type Selection } from "@/components/atlas/Dossier";
import { Button } from "@/components/ui/button";
import { AppHeader, Chip } from "@/components/shell/AppHeader";
import { Input } from "@/components/ui/input";
import { LAYERS, type CountyId, type LayerId } from "@/data/island";
import { frontById } from "@/data/fronts";
import { cn } from "@/lib/utils";

const defaultLayers = Object.fromEntries(LAYERS.map((l) => [l.id, l.defaultOn])) as Record<
  LayerId,
  boolean
>;

export function AtlasApp() {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const frontsMode = search.view === "fronts";
  const [selection, setSelection] = useState<Selection>(selectionFromSearch(search));
  const [layers, setLayers] = useState(defaultLayers);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(Boolean(search.place || search.county || search.front));
  const [locator, setLocator] = useState(false);

  useEffect(() => {
    setSelection(selectionFromSearch(search));
    if (search.place || search.county || search.front) setMobileOpen(true);
  }, [search.place, search.county, search.front, search.view]);

  const layerList = useMemo(() => LAYERS, []);

  function select(next: Selection) {
    setSelection(next);
    setMobileOpen(true);
    if (next.type === "front") {
      void navigate({ search: { view: "fronts", front: next.id }, replace: true });
      return;
    }
    if (frontsMode && next.type === "overview") {
      void navigate({ search: { view: "fronts" }, replace: true });
      return;
    }
    void navigate({
      search:
        next.type === "place"
          ? { place: next.id }
          : next.type === "county"
            ? { county: next.id }
            : {},
      replace: true,
    });
  }

  function toggleFronts() {
    if (frontsMode) {
      void navigate({ search: {}, replace: true });
      setSelection({ type: "overview" });
    } else {
      void navigate({ search: { view: "fronts" }, replace: true });
      setSelection({ type: "overview" });
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-ink text-paper">
      <AppHeader
        search={query}
        onSearch={(v) => {
          setQuery(v);
          setMobileOpen(true);
        }}
        searchLabel={frontsMode ? "Search fronts, impulses" : "Search towns, towers, sites"}
        extra={
          <>
            <Button
              variant={frontsMode ? "default" : "secondary"}
              size="sm"
              onClick={toggleFronts}
              aria-pressed={frontsMode}
            >
              Fronts
            </Button>
            {!frontsMode && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setLocator((v) => !v)}
                aria-pressed={locator}
              >
                Sound chart
              </Button>
            )}
          </>
        }
      />

      <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setMobileOpen(true);
          }}
          placeholder={frontsMode ? "Search fronts" : "Search the atlas"}
          aria-label={frontsMode ? "Search fronts" : "Search the atlas"}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2 overflow-x-auto px-4 py-2">
        {frontsMode ? (
          <p className="text-xs tracking-widest text-muted uppercase">Clocks · impulses · empty chairs</p>
        ) : (
          <>
            <Layers className="size-4 shrink-0 text-muted" />
            {layerList.map((l) => (
              <Chip
                key={l.id}
                active={layers[l.id]}
                onClick={() => setLayers((s) => ({ ...s, [l.id]: !s[l.id] }))}
              >
                {l.label}
              </Chip>
            ))}
          </>
        )}
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 lg:right-[22.5rem]">
          {frontsMode ? (
            <FrontsMap
              selected={selection.type === "front" ? selection.id : null}
              onSelect={(id) => select({ type: "front", id })}
            />
          ) : (
            <IslandMap selection={selection} onSelect={select} layers={layers} />
          )}
        </div>

        {locator && !frontsMode && (
          <div className="absolute bottom-4 left-4 z-10 hidden w-[min(28rem,calc(100%-2rem))] overflow-hidden rounded-xl bg-elevated shadow-border md:block">
            <img
              src="/charts/sound-locator.jpg"
              alt="Silent Island in Long Island Sound, south of Bridgeport"
              className="aspect-[5/4] w-full object-cover outline outline-1 -outline-offset-1 outline-paper/10"
            />
            <p className="px-3 py-2 text-xs text-muted">
              Locator: Silent Island in the Sound, south of Bridgeport and north of Long Island.
            </p>
          </div>
        )}

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
              <Dossier
                selection={selection}
                onSelect={select}
                query={query}
                frontsMode={frontsMode}
                onClose={() => select({ type: "overview" })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function selectionFromSearch(search: {
  place?: string;
  county?: CountyId;
  view?: "fronts";
  front?: string;
}): Selection {
  if (search.view === "fronts") {
    if (search.front && frontById(search.front)) return { type: "front", id: search.front };
    return { type: "overview" };
  }
  if (search.place) return { type: "place", id: search.place };
  if (search.county) return { type: "county", id: search.county };
  return { type: "overview" };
}
