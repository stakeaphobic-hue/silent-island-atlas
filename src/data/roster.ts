import raw from "./roster.json";
import { placeLink, peopleAtPlace } from "./place-people";
export { placeLink };

export type Character = {
  id: string;
  name: string;
  faction: string;
  bucket: string;
  splat: string;
  role: string;
  shows: string;
  age: string;
  ethnicity: string;
  publicImage: string;
  notes: string;
  background: string;
};

export const ROSTER = raw as Character[];

export const BUCKETS = [
  "Island",
  "Kindred",
  "Immortal",
  "Hunter",
  "Mage",
  "Media",
  "Sports",
  "Mortal",
  "Other",
] as const;

export const SPLATS = [
  "Vampire",
  "Awakened Immortal",
  "Mage",
  "Ghoul",
  "Fae",
  "Mortal",
  "Unspecified",
] as const;

export const FEATURED_IDS = [
  "envy-devareaux-pandemonium",
  "antonio-devareaux",
  "siobhan-o-rourke-immortal",
  "baptiste-baron-delacroix",
  "cassian-still-vasser",
  "bella-morales",
  "monica-vale",
  "vaughn-merlot",
  "veronique-blackstone",
  "natasha-volkov",
] as const;

export const FEATURED: Character[] = FEATURED_IDS.map((id) => ROSTER.find((c) => c.id === id)).filter(
  (c): c is Character => Boolean(c),
);

export const BUCKET_COUNTS: Record<string, number> = Object.fromEntries(
  BUCKETS.map((b) => [b, ROSTER.filter((c) => c.bucket === b).length]),
);

export function searchRoster(
  q: string,
  bucket: string | "all",
  splat: string | "all",
): Character[] {
  const tokens = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return ROSTER.filter((c) => {
    if (bucket !== "all" && c.bucket !== bucket) return false;
    if (splat !== "all") {
      if (splat === "Vampire") {
        if (!c.splat.startsWith("Vampire")) return false;
      } else if (splat === "Mortal") {
        if (!c.splat.startsWith("Mortal") && c.splat !== "Human") return false;
      } else if (c.splat !== splat) return false;
    }
    if (!tokens.length) return true;
    const hay = haystack(c);
    return tokens.every((t) => hay.includes(t));
  }).sort((a, b) => {
    const r = featuredRank(a) - featuredRank(b);
    if (r !== 0) return r;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

function featuredRank(c: Character) {
  const i = (FEATURED_IDS as readonly string[]).indexOf(c.id);
  return i === -1 ? 1000 : i;
}

function haystack(c: Character) {
  return `${c.name} ${c.faction} ${c.role} ${c.splat} ${c.shows} ${c.notes} ${c.background} ${c.publicImage} ${c.bucket}`.toLowerCase();
}

export function initials(name: string) {
  const parts = name.replace(/[“”"']/g, "").split(/\s+/).filter(Boolean);
  const letters = parts
    .filter((p) => !/^\(|^aka|^the$|^immortal$/i.test(p))
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return letters || "?";
}

export function byId(id: string) {
  return ROSTER.find((c) => c.id === id);
}

export type Tie = { person: Character; why: string };

export function familyName(name: string) {
  const cleaned = name.replace(/[“”"'‘’]/g, "").replace(/\([^)]*\)/g, " ");
  const parts = cleaned
    .split(/\s+/)
    .map((p) => p.replace(/[.,]/g, ""))
    .filter((p) => p && !/^(aka|the|de|del|la|le|van|von|immortal)$/i.test(p));
  return (parts.at(-1) ?? "").toLowerCase();
}

const FAMILY_COUNTS: Record<string, number> = {};
for (const c of ROSTER) {
  const n = familyName(c.name);
  if (n.length > 2) FAMILY_COUNTS[n] = (FAMILY_COUNTS[n] ?? 0) + 1;
}

export function tiesFor(id: string): Tie[] {
  const self = byId(id);
  if (!self) return [];
  const out: Tie[] = [];
  const seen = new Set<string>([id]);

  const ln = familyName(self.name);
  if (ln.length > 2 && (FAMILY_COUNTS[ln] ?? 0) >= 2 && (FAMILY_COUNTS[ln] ?? 0) <= 16) {
    for (const c of ROSTER) {
      if (seen.has(c.id)) continue;
      if (familyName(c.name) === ln) {
        out.push({ person: c, why: "Same name" });
        seen.add(c.id);
      }
    }
  }

  const blob = `${self.notes} ${self.background} ${self.faction} ${self.role}`.toLowerCase();
  for (const c of ROSTER) {
    if (seen.has(c.id)) continue;
    const needle = c.name.replace(/\s*\([^)]*\)/g, "").replace(/[“”"'‘’]/g, "").trim();
    if (needle.length < 8) continue;
    if (blob.includes(needle.toLowerCase())) {
      out.push({ person: c, why: "Named in file" });
      seen.add(c.id);
    }
  }

  const ground = placeLink(self.id);
  if (ground) {
    for (const pid of ground.places) {
      for (const p of peopleAtPlace(pid)) {
        if (seen.has(p.id)) continue;
        const person = byId(p.id);
        if (!person) continue;
        out.push({ person, why: "Same ground" });
        seen.add(p.id);
      }
    }
  }

  const pack = ROSTER.filter((c) => c.faction === self.faction && c.id !== self.id);
  if (pack.length > 0 && pack.length <= 12) {
    for (const c of pack) {
      if (seen.has(c.id)) continue;
      out.push({ person: c, why: "Same faction" });
      seen.add(c.id);
      if (out.length >= 12) break;
    }
  }

  return out.slice(0, 12);
}

