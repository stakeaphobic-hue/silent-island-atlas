import type { CountyId } from "./island";

export type LinkedPerson = {
  id: string;
  name: string;
  role: string;
  bucket: string;
  places: string[];
  county: CountyId;
};

const DEADLIES: Array<Omit<LinkedPerson, "places" | "county" | "bucket">> = [
  { id: "cassian-still-vasser", name: "Cassian “Still” Vasser", role: "Player / Forward / Presence" },
  { id: "rowan-void-kane", name: "Rowan “Void” Kane", role: "Player / Guard / Silence" },
  { id: "silas-bleed-crowe", name: "Silas “Bleed” Crowe", role: "Player / Wing / Reach" },
  { id: "jeremiah-quiet-ash", name: "Jeremiah “Quiet” Ash", role: "Player / Point / Control" },
  { id: "lucien-end-graves", name: "Lucien “End” Graves", role: "Player / Center / Wall" },
  { id: "nyra-end-holloway", name: "Nyra “End” Holloway", role: "Player / Wing / Finisher" },
  { id: "vera-still-black", name: "Vera “Still” Black", role: "Player / Guard / Silence" },
  { id: "ivy-bleed-morse", name: "Ivy “Bleed” Morse", role: "Player / Forward / Reach" },
  { id: "sable-quiet-wren", name: "Sable “Quiet” Wren", role: "Player / Point / Control" },
  { id: "mira-void-kane", name: "Mira “Void” Kane", role: "Player / Post / Presence" },
  { id: "lira-still-voss", name: "Lira “Still” Voss", role: "Cheerleader / Presence" },
  { id: "eden-bleed-crowe", name: "Eden “Bleed” Crowe", role: "Cheerleader / Extension" },
  { id: "noa-quiet-ash", name: "Noa “Quiet” Ash", role: "Cheerleader / Control" },
  { id: "raven-void-graves", name: "Raven “Void” Graves", role: "Cheerleader / Wall" },
  { id: "wren-end-hollow", name: "Wren “End” Hollow", role: "Cheerleader / Finisher" },
];

export const LINKED_PEOPLE: LinkedPerson[] = [
  {
    id: "siobhan-o-rourke-immortal",
    name: "Siobhan O’Rourke (Immortal)",
    role: "Deadly swordswoman / occult information broker",
    bucket: "Island",
    places: ["shell-beach"],
    county: "eerier",
  },
  {
    id: "baptiste-baron-delacroix",
    name: "Baptiste “Baron” Delacroix",
    role: "Voodoo Warlord — feared ground holder of The Gilded Shroud",
    bucket: "Island",
    places: ["gilded-shroud"],
    county: "countess",
  },
  ...DEADLIES.map((p) => ({
    ...p,
    bucket: "Island",
    places: ["silent-city"],
    county: "silent" as const,
  })),
];

export function peopleAtPlace(placeId: string) {
  return LINKED_PEOPLE.filter((p) => p.places.includes(placeId));
}

export function peopleInCounty(county: CountyId) {
  return LINKED_PEOPLE.filter((p) => p.county === county);
}

export function placeLink(id: string) {
  const p = LINKED_PEOPLE.find((x) => x.id === id);
  return p ? { places: p.places, county: p.county } : undefined;
}
