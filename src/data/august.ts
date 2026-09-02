/** Season 0 — August 2026. Source: Drive "Time Line Season 0 (2026)" modified 2026-08-20.
 *  Mayor names are ST-desk parody locks (not the living offices). Immortal at Clappers still blank. */

export type AugustBeat = "discord" | "in-person";

export type AugustSite = {
  id: string;
  name: string;
  beat: AugustBeat;
  atlas: "shore" | "city" | "island" | "fronts";
  placeId: string;
  what: string;
  blank: string;
};

export const AUGUST_SOURCE =
  "Time Line Season 0 (2026) — Discord: Bridgeport, Waterbury, Silent City mayors found dead. Banishment to Nod plot started. Tablets of fake revelations planted along with the mayor’s deaths. Death of an immortal at Bridgeport Bluefish Clappers BASEketball Stadium. In person: Holy Land, CT crisis avoided.";

export const AUGUST_SITES: AugustSite[] = [
  {
    id: "mayor-bridgeport",
    name: "Joseph P. Gainim — found dead",
    beat: "discord",
    atlas: "shore",
    placeId: "bridgeport",
    what: "August Discord beat. Bridgeport mayor Joseph P. Gainim is a body. Tablets of fake revelations planted with the death.",
    blank: "Who planted the tablets. Whether the body is the man the harbor thought it had.",
  },
  {
    id: "mayor-waterbury",
    name: "Paul K. Pernerowski, Jr. — found dead",
    beat: "discord",
    atlas: "shore",
    placeId: "waterbury",
    what: "August Discord beat. Waterbury mayor Paul K. Pernerowski, Jr. is a body. Same month as Bridgeport and Silent City. Tablets planted with the death.",
    blank: "Tie to Holy Land / Judas Kline / Lukas — not locked.",
  },
  {
    id: "mayor-silent-city",
    name: "Richard Vernon — found dead",
    beat: "discord",
    atlas: "city",
    placeId: "downtown",
    what: "August Discord beat. Silent City mayor Richard Vernon is a body. Tablets planted with the death. Ties the three theaters.",
    blank: "Where in the fog core the body was left.",
  },
  {
    id: "clappers-immortal",
    name: "Immortal dead — Bluefish Clappers",
    beat: "discord",
    atlas: "shore",
    placeId: "clappers",
    what: "Death of an immortal at Bridgeport Bluefish Clappers BASEketball Stadium. Same August Discord beat as the mayors.",
    blank: "Which immortal. Whether the crowd saw it. Whether it was a game night.",
  },
  {
    id: "holy-land",
    name: "Holy Land — crisis avoided",
    beat: "in-person",
    atlas: "shore",
    placeId: "waterbury",
    what: "In-person August beat: Holy Land, CT crisis avoided. Separate from the Discord mayor deaths. Do not collapse them into one scene.",
    blank: "What the crisis was. Who avoided it. Whether the hill still holds a cell.",
  },
];

export const AUGUST_DEATH_PLACE_IDS = [
  "bridgeport",
  "waterbury",
  "clappers",
  "downtown",
  "silent-city",
] as const;

export function augustAt(placeId: string) {
  return AUGUST_SITES.filter((s) => s.placeId === placeId);
}

export function isAugustDeathPlace(placeId: string) {
  return (AUGUST_DEATH_PLACE_IDS as readonly string[]).includes(placeId);
}

/** ST-desk parody locks. Not the living offices. */
export const AUGUST_MAYORS = [
  { id: "joseph-p-gainim", name: "Joseph P. Gainim", city: "Bridgeport", placeId: "bridgeport" },
  { id: "paul-k-pernerowski-jr", name: "Paul K. Pernerowski, Jr.", city: "Waterbury", placeId: "waterbury" },
  { id: "richard-vernon", name: "Richard Vernon", city: "Silent City", placeId: "downtown" },
] as const;
