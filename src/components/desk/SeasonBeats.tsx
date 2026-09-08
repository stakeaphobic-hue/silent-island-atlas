import { Link } from "@tanstack/react-router";
import { ELECTION_TICKETS, SEASON0, season0At, type SeasonBeat } from "@/data/season0";

const ATLAS_TO: Record<SeasonBeat["atlas"], "/" | "/shore" | "/city"> = {
  shore: "/shore",
  city: "/city",
  island: "/",
  fronts: "/",
};

export function SeasonBeats({ placeId }: { placeId?: string }) {
  const beats = placeId ? season0At(placeId) : SEASON0;
  if (!beats.length) return null;
  const tickets = placeId
    ? ELECTION_TICKETS.filter((t) => t.placeId === placeId || (placeId === "shell-beach" && t.placeId === "downtown"))
    : [];

  return (
    <section className="mt-5">
      <h3 className="text-xs font-medium tracking-widest text-muted uppercase">
        {placeId ? "Season 0 on this ground" : "Season 0 · May–September 2026"}
      </h3>
      <ol className="mt-2 space-y-3">
        {beats.map((b) => (
          <li key={b.id}>
            <p className="text-[11px] tabular-nums tracking-wide text-brass">
              {b.date}
              {b.done ? "" : " · open"}
            </p>
            <p className="text-sm text-paper">{b.title}</p>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">{b.what}</p>
            {b.blank ? (
              <p className="mt-1 text-xs italic text-subtle-fg">Blank — {b.blank}</p>
            ) : null}
            {!placeId ? (
              <BeatLink beat={b} />
            ) : null}
          </li>
        ))}
      </ol>
      {tickets.map((t) => (
        <div key={t.city} className="mt-3 rounded-xl border border-dashed border-border px-3 py-3">
          <p className="text-xs tracking-widest text-muted uppercase">{t.city} · tickets</p>
          <ul className="mt-2 space-y-2">
            {t.candidates.map((c) => (
              <li key={c.id}>
                <Link to="/roster" search={{ id: c.id }} className="text-sm text-paper hover:text-brass">
                  {c.name}
                </Link>
                <p className="text-xs text-muted">{c.anthem}</p>
                <p className="text-xs text-subtle-fg">{c.note}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function BeatLink({ beat }: { beat: SeasonBeat }) {
  if (beat.atlas === "fronts") {
    return (
      <Link
        to="/"
        search={{ view: "fronts", front: beat.placeId }}
        className="mt-1 inline-block text-xs text-brass"
      >
        Open front
      </Link>
    );
  }
  if (beat.atlas === "shore") {
    return (
      <Link to="/shore" search={{ town: beat.placeId }} className="mt-1 inline-block text-xs text-brass">
        Open shore pin
      </Link>
    );
  }
  if (beat.atlas === "city") {
    return (
      <Link to="/city" search={{ place: beat.placeId }} className="mt-1 inline-block text-xs text-brass">
        Open city pin
      </Link>
    );
  }
  return (
    <Link
      to={ATLAS_TO[beat.atlas]}
      search={beat.atlas === "island" ? { county: beat.placeId === "countess" ? "countess" : undefined, place: beat.placeId === "countess" ? undefined : beat.placeId } : undefined}
      className="mt-1 inline-block text-xs text-brass"
    >
      Open chart
    </Link>
  );
}
