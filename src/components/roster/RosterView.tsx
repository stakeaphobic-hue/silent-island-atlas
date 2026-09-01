import { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Compass, Search } from "lucide-react";
import { AppHeader, Chip } from "@/components/shell/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { placeById } from "@/data/island";
import {
  BUCKETS,
  BUCKET_COUNTS,
  FEATURED,
  ROSTER,
  SPLATS,
  byId,
  initials,
  placeLink,
  searchRoster,
  tiesFor,
  type Character,
} from "@/data/roster";
import { portraitOf } from "@/data/portraits";
import { cn } from "@/lib/utils";

type RosterSearch = {
  q?: string;
  desk?: string;
  splat?: string;
  id?: string;
  browse?: boolean;
};

export function RosterView() {
  const search = useSearch({ from: "/roster" }) as RosterSearch;
  const navigate = useNavigate({ from: "/roster" });
  const q = search.q ?? "";
  const desk = search.desk ?? "all";
  const splat = search.splat ?? "all";
  const activeId = search.id;
  const browse = Boolean(search.browse);

  const listing = Boolean(q.trim() || desk !== "all" || splat !== "all" || browse || activeId);
  const results = useMemo(() => searchRoster(q, desk, splat), [q, desk, splat]);
  const selected = (activeId && (results.find((c) => c.id === activeId) ?? byId(activeId))) || null;
  const desktopPerson = selected ?? (listing ? results[0] ?? null : null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!activeId) return;
    const node = listRef.current?.querySelector(`[data-id="${activeId}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [activeId, listing]);

  function patch(next: Partial<RosterSearch>) {
    const merged: RosterSearch = { ...search, ...next };
    const out: RosterSearch = {};
    if (merged.q?.trim()) out.q = merged.q;
    if (merged.desk && merged.desk !== "all") out.desk = merged.desk;
    if (merged.splat && merged.splat !== "all") out.splat = merged.splat;
    if (merged.id) out.id = merged.id;
    if (merged.browse) out.browse = true;
    void navigate({ search: out, replace: true });
  }

  return (
    <div className="flex h-dvh flex-col bg-ink text-paper">
      <AppHeader
        search={q}
        onSearch={(v) => patch({ q: v, id: undefined })}
        searchLabel="Name, faction, or role"
      />

      <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
        <Input
          value={q}
          onChange={(e) => patch({ q: e.target.value, id: undefined })}
          placeholder="Name, faction, or role"
          aria-label="Look up a name, faction, or role"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2 overflow-x-auto px-4 py-2">
        <Chip
          active={desk === "all" && !browse && !q.trim() && splat === "all"}
          onClick={() => patch({ desk: "all", splat: "all", q: "", id: undefined, browse: false })}
        >
          Lookup
        </Chip>
        {BUCKETS.map((b) => (
          <Chip key={b} active={desk === b} onClick={() => patch({ desk: b, id: undefined, browse: false })}>
            {b}
            <span className="ml-1.5 tabular-nums opacity-60">{BUCKET_COUNTS[b]}</span>
          </Chip>
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border px-4 pb-2">
        <Chip active={splat === "all"} onClick={() => patch({ splat: "all", id: undefined })}>
          All splats
        </Chip>
        {SPLATS.map((s) => (
          <Chip key={s} active={splat === s} onClick={() => patch({ splat: s, id: undefined })}>
            {s === "Awakened Immortal" ? "Immortal" : s}
          </Chip>
        ))}
      </div>

      {!listing ? (
        <LookupHome onOpen={(c) => patch({ id: c.id, desk: c.bucket })} onBrowse={() => patch({ browse: true })} />
      ) : (
        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_22.5rem]">
          <div className="min-h-0 overflow-y-auto">
            <p className="px-4 py-3 text-xs tabular-nums text-muted" aria-live="polite">
              {results.length.toLocaleString()} of {ROSTER.length.toLocaleString()}
            </p>
            {results.length === 0 ? (
              <p className="px-4 pb-8 text-sm text-muted">No names match that lookup.</p>
            ) : (
              <ul ref={listRef} className="divide-y divide-border">
                {results.map((c) => (
                  <li key={c.id} data-id={c.id}>
                    <button
                      type="button"
                      onClick={() => patch({ id: c.id })}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)] hover:bg-elevated",
                        desktopPerson?.id === c.id && "bg-elevated",
                      )}
                    >
                      <Avatar id={c.id} name={c.name} splat={c.splat} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-paper">{c.name}</span>
                        <span className="block truncate text-xs text-muted">
                          {c.role} · {c.faction}
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-xs text-subtle-fg sm:block">{shortSplat(c.splat)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="hidden min-h-0 overflow-y-auto border-l border-border bg-elevated lg:block">
            {desktopPerson ? (
              <DossierCard person={desktopPerson} />
            ) : (
              <p className="p-5 text-sm text-muted">No match.</p>
            )}
          </aside>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-30 flex flex-col bg-elevated lg:hidden">
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-2 py-2">
            <Button variant="ghost" size="sm" onClick={() => patch({ id: undefined })}>
              <ArrowLeft />
              Back
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <DossierCard person={selected} />
          </div>
        </div>
      )}
    </div>
  );
}

function LookupHome({
  onOpen,
  onBrowse,
}: {
  onOpen: (c: Character) => void;
  onBrowse: () => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-10">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Storyteller desk</p>
        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">Character lookup</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          {ROSTER.length.toLocaleString()} names on file. Search a name, faction, or role — then read history and follow ties.
        </p>

        <section className="mt-8">
          <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Pinned</h3>
          <ul className="mt-3 divide-y divide-border rounded-xl bg-elevated shadow-border">
            {FEATURED.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onOpen(c)}
                  className="flex min-h-11 w-full items-center gap-3 px-4 py-3 text-left hover:bg-subtle"
                >
                  <Avatar id={c.id} name={c.name} splat={c.splat} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-paper">{c.name}</span>
                    <span className="block truncate text-xs text-muted">
                      {c.role} · {c.bucket}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Desks</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BUCKETS.map((b) => (
              <li key={b}>
                <Link
                  to="/roster"
                  search={{ desk: b }}
                  className="flex min-h-11 items-center justify-between rounded-xl bg-elevated px-4 py-3 shadow-border hover:bg-subtle"
                >
                  <span className="text-sm">{b}</span>
                  <span className="text-xs tabular-nums text-muted">{BUCKET_COUNTS[b]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="mt-3 w-full sm:w-auto" onClick={onBrowse}>
            <Search className="size-4" />
            Entire file · {ROSTER.length.toLocaleString()}
          </Button>
        </section>
      </div>
    </div>
  );
}

function DossierCard({ person }: { person: Character }) {
  const link = placeLink(person.id);
  const places = link?.places.map((id) => placeById(id)).filter(Boolean) ?? [];
  const portrait = portraitOf(person.id);
  const ties = tiesFor(person.id);
  const history = cleanBackground(person.background);
  const empty = !person.publicImage && !person.notes && !history && ties.length === 0;

  return (
    <div className="px-5 py-5">
      {portrait ? (
        <div className="mb-4 flex items-start gap-4">
          <img
            src={portrait}
            alt={person.name}
            className="size-24 shrink-0 rounded-lg object-cover shadow-border sm:size-28"
          />
          <div className="min-w-0 pt-0.5">
            <p className="text-xs font-medium tracking-widest text-muted uppercase">{person.bucket}</p>
            <h2 className="mt-1 font-display text-2xl font-medium leading-tight">{person.name}</h2>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">{person.bucket}</p>
          <h2 className="mt-1 font-display text-2xl font-medium leading-tight">{person.name}</h2>
        </>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="brass">{person.splat}</Badge>
        {person.age ? <Badge>{person.age}</Badge> : null}
        {person.ethnicity ? <Badge>{person.ethnicity}</Badge> : null}
      </div>
      <p className="mt-4 text-sm text-steel">{person.role}</p>
      <p className="mt-1 text-xs text-muted">{person.faction}</p>
      {person.shows ? <p className="mt-1 text-xs text-muted">{person.shows}</p> : null}

      {places.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {places.map((p) =>
            p ? (
              <Button key={p.id} variant="secondary" size="sm" asChild>
                <Link to="/" search={{ place: p.id }}>
                  <Compass className="size-3.5" />
                  {p.name}
                </Link>
              </Button>
            ) : null,
          )}
        </div>
      )}

      <Separator className="my-4" />

      <DossierSection label="History" text={history} />

      {ties.length > 0 && (
        <section className="mt-5">
          <h3 className="text-xs font-medium tracking-widest text-muted uppercase">Ties</h3>
          <ul className="mt-2 divide-y divide-border rounded-lg bg-subtle">
            {ties.map((t) => (
              <li key={t.person.id}>
                <Link
                  to="/roster"
                  search={{ id: t.person.id, desk: t.person.bucket }}
                  className="flex min-h-11 items-center gap-3 px-3 py-2 hover:bg-elevated"
                >
                  <Avatar id={t.person.id} name={t.person.name} splat={t.person.splat} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-paper">{t.person.name}</span>
                    <span className="block truncate text-xs text-muted">{t.why}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <DossierSection label="Manner" text={person.notes} />
      <DossierSection label="Mask" text={person.publicImage} />

      {empty ? (
        <p className="text-sm text-muted">Name, desk, and splat only. No further notes on file.</p>
      ) : null}
    </div>
  );
}

function DossierSection({ label, text }: { label: string; text: string }) {
  if (!text) return null;
  return (
    <section className="mt-4 first:mt-0">
      <h3 className="text-xs font-medium tracking-widest text-muted uppercase">{label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-paper">{text}</p>
    </section>
  );
}

function Avatar({ id, name, splat }: { id: string; name: string; splat: string }) {
  const src = portraitOf(id);
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="size-10 shrink-0 rounded-md object-cover"
      />
    );
  }
  return <Monogram name={name} splat={splat} />;
}

function Monogram({ name, splat }: { name: string; splat: string }) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-md bg-subtle font-display text-sm",
        splat.startsWith("Vampire") || splat === "Awakened Immortal" ? "text-brass" : "text-steel",
      )}
    >
      {initials(name)}
    </span>
  );
}

function shortSplat(splat: string) {
  if (splat.startsWith("Vampire")) return "Vampire";
  if (splat === "Awakened Immortal") return "Immortal";
  if (splat.startsWith("Mortal")) return "Mortal";
  return splat;
}

function cleanBackground(text: string) {
  if (!text) return "";
  if (/^ENVYVERSE_|^appears in |^part of the /i.test(text) && text.length < 180) return "";
  return text;
}
