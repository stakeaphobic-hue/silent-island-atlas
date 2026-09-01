export type ShoreKind = "city" | "town" | "tower";
export type ShoreCounty = "East Fairfield" | "New Haven";

export type ShoreTown = {
  id: string;
  name: string;
  county: ShoreCounty;
  kind: ShoreKind;
  x: number;
  y: number;
  r: number;
  summary: string;
  body: string;
  tags: string[];
  blanks: string[];
  people: { id: string; name: string; role: string }[];
  parent?: string;
  image?: string;
  label?: "top" | "left" | "right" | "bottom";
};

export const SHORE_OVERVIEW = {
  name: "The Shore",
  summary: "Bridgeport and the towns it bleeds into — East Fairfield, Waterbury inland, New Haven as its own city.",
  body: "Season 0 drives these streets. Silent Island sits in the Sound — a different book that this shore points at, not a ninth town.\n\nTwo BBC needles stand in Bridgeport. BWC DV stands in Waterbury. BWC DA lives on the Gilded Shroud. People who say “BBC DA” mean the Midtown HQ’s Digital Arts name — same envelope as BBC DVDA, not a fourth Bridgeport building.",
};

export const SHORE_TOWNS: ShoreTown[] = [
  {
    id: "easton",
    name: "Easton",
    county: "East Fairfield",
    kind: "town",
    x: 210,
    y: 118,
    r: 11,
    summary: "Rural northwest. Reservoirs, woods, the place Bridgeport pretends the country starts.",
    body: "Inland of Fairfield and west of Monroe. Two-lane roads, water company land, houses that sit back from the street. The night circuit keeps a team here. No Kindred court is locked for Easton — do not seat one to balance the harbor.",
    tags: ["Inland", "Rural"],
    blanks: ["Who actually hunts here after dark."],
    people: [],
  },
  {
    id: "monroe",
    name: "Monroe",
    county: "East Fairfield",
    kind: "town",
    x: 390,
    y: 96,
    r: 11,
    summary: "Further inland. Quiet on paper. North of Trumbull, east of Easton.",
    body: "Bedroom streets and a name that shows up on a sports sheet more than in Kindred minutes. Leave the court empty until play puts someone in it.",
    tags: ["Inland"],
    blanks: ["Whether Monroe is a hunting ground or just a place people sleep."],
    people: [],
  },
  {
    id: "trumbull",
    name: "Trumbull",
    county: "East Fairfield",
    kind: "town",
    x: 300,
    y: 188,
    r: 13,
    summary: "Inland north of Bridgeport. The Meat. Where the harbor’s night goes to live.",
    body: "Not on the Sound. Close enough that Bridgeport money and Bridgeport trouble both commute. Local identity is stubborn and physical. No prince, no Elysium on file — a town the city uses.",
    tags: ["Inland", "Sports"],
    blanks: ["How much of the Meat is just a team, and how much is a crew."],
    people: [],
  },
  {
    id: "shelton",
    name: "Shelton",
    county: "East Fairfield",
    kind: "city",
    x: 500,
    y: 168,
    r: 13,
    summary: "Housatonic valley. Between Stratford’s mouth and the inland towns.",
    body: "Industrial leftover meeting new money. The river is the fact; the rest is still a blank. Nothing in the island packet seats a court here. Keep it as a road and a river until someone writes otherwise.",
    tags: ["River"],
    blanks: ["Who holds the river after dark. The desk has no Shelton names yet."],
    people: [],
  },
  {
    id: "fairfield",
    name: "Fairfield",
    county: "East Fairfield",
    kind: "town",
    x: 148,
    y: 292,
    r: 14,
    summary: "West of the harbor, on the Sound. The county’s name lives here. Money that pretends it isn’t Bridgeport.",
    body: "Town green, shoreline, the polite face of East Fairfield. Bridgeport’s west wall. The night circuit has a team the public chart does not name. Kindred holdings are not locked — do not import a Camarilla suburb just because the real estate looks like one.",
    tags: ["Sound", "Money"],
    blanks: ["Whether old money here is mortal, Immortal, or just expensive."],
    people: [],
  },
  {
    id: "bridgeport",
    name: "Bridgeport",
    county: "East Fairfield",
    kind: "city",
    x: 300,
    y: 318,
    r: 22,
    summary: "The engine. Harbor, BBC, a dead prince, a precinct that is now a question.",
    body: "Season 0 lives here and points at Silent Island. Adrienne Waters is dead. The Esbat is rubble (June). Camarilla agents probe the mainland; they are not seated on the island.\n\nMay 12, 2026: 76th Precinct demolished. Forty-five actual dead. Sixty-six bodies planted. Public story: seventy-six, no survivors. Bandidos on Harbinger contract, so the Archbishop would bless a Temple of Caine on the rubble.\n\nNicholas Vega is City Planner — Fontana’s clean face. BBC is the signal the rest of the shore cannot turn off. South End still smells like the firesale.",
    tags: ["Harbor", "BBC", "Season 0"],
    blanks: ["August and September on the calendar — empty in the source. Leave them."],
    people: [
      { id: "monica-vale", name: "Monica Vale", role: "The Red Room" },
      { id: "bella-morales", name: "Bella Morales", role: "Crash Report" },
      { id: "vaughn-merlot", name: "Vaughn Merlot", role: "BBC" },
      { id: "natasha-volkov", name: "Natasha Volkov", role: "Late night" },
      { id: "nicholas-vega", name: "Nicholas Vega", role: "City Planner" },
      { id: "antonio-fontana", name: "Antonio Fontana", role: "Fontana face" },
    ],
  },
  {
    id: "bbc-dp",
    name: "BBC DP",
    county: "East Fairfield",
    kind: "tower",
    x: 332,
    y: 348,
    r: 8,
    label: "right",
    parent: "bridgeport",
    summary: "The old airship tower. Downtown Park. 2,666 ft. Not the media HQ.",
    body: "Bridgeport Business Center of Downtown Park. The original needle: 2,666 feet of basalt-black art-deco, 1950s Masonic civic prestige, a Tura limestone pyramid that drinks moonlight. No neon. No BBC DVDA mark.\n\nBuilt as an airship port. Traffic never came. The gantries are sealed; the lights stay on. Ownership and present function are open on purpose.\n\nThis is not BBC DVDA. The Midtown HQ is shorter, branded, and purple. This is not BWC DA — that tower is on the Gilded Shroud, Silent Island, and has a docking ring instead of a pyramid.",
    tags: ["Tower", "Downtown", "2,666 ft", "Airship"],
    blanks: ["Who pays the bills. Who walks the upper floors."],
    people: [],
  },
  {
    id: "bbc-dvda",
    name: "BBC DVDA",
    county: "East Fairfield",
    kind: "tower",
    x: 248,
    y: 288,
    r: 8,
    label: "left",
    parent: "bridgeport",
    image: "/towers/bbc-dvda.png",
    summary: "Midtown media HQ. 1,666 ft. Purple neon. The Empire’s public face.",
    body: "Bridgeport Bulletin Correspondance Divine Vogue Digital Arts. Completed July 6. Live studios for The Red Room, Crash Report, Midnight Feed, Dominion Hour. Talent floors, uncut-masters, the brand that the rest of the shore cannot turn off.\n\nPeople say “BBC DA.” DA is Digital Arts — the same Midtown envelope, not a second needle and not the island tower. BWC DA is Bedlam Woe on the Gilded Shroud. BWC DV is Bedlam Woe’s Divine Vogue building in Waterbury — same two letters, different corporation, different city. BBC DP is the older Downtown Park airship tower, two hundred feet taller, no neon.\n\nCrown left undefined so it cannot be confused with DP’s Tura pyramid. Control of the Empire remains ???.",
    tags: ["Tower", "BBC DA", "Midtown", "1,666 ft"],
    blanks: ["Who actually controls the Empire."],
    people: [
      { id: "monica-vale", name: "Monica Vale", role: "The Red Room" },
      { id: "bella-morales", name: "Bella Morales", role: "Crash Report" },
    ],
  },
  {
    id: "stratford",
    name: "Stratford",
    county: "East Fairfield",
    kind: "town",
    x: 448,
    y: 308,
    r: 14,
    summary: "East of the harbor. Housatonic mouth. Looks at the Sound and at Shelton.",
    body: "Sikorsky’s shadow, a barrier beach, the river opening into the Sound. Not Bridgeport and tired of being treated like it. Ruby Quinn’s file puts her east through here. No court locked.",
    tags: ["Sound", "River"],
    blanks: ["Whether Stratford is a border or just a commute."],
    people: [{ id: "ruby-quinn", name: "Ruby Quinn", role: "Came east through here" }],
  },
  {
    id: "new-haven",
    name: "New Haven",
    county: "New Haven",
    kind: "city",
    x: 780,
    y: 300,
    r: 18,
    summary: "Own county. Own harbor. Own city. Not East Fairfield, and not a suburb of Bridgeport.",
    body: "The Green, the hill, a harbor that faces a different piece of the Sound. Yale is the mortal fact everyone already knows. Kindred domain is not on this desk — no prince, no wards, no Rack locked.\n\nIt belongs on this chart because the road east is real. It does not get a fake court to look finished.",
    tags: ["Own county", "Harbor"],
    blanks: ["Who holds New Haven. Write a packet before you seat anyone."],
    people: [],
  },
  {
    id: "waterbury",
    name: "Waterbury",
    county: "New Haven",
    kind: "city",
    x: 500,
    y: 58,
    r: 16,
    summary: "Brass City. Inland, up Route 8. Not the Sound, and not a suburb.",
    body: "Naugatuck Valley. New Haven County. Union Station’s clock still runs. Holy Land sits on the hill above the city — the Children of Caine cell there was rolled up by the FBI; most of the listed names are in federal custody. Judas Kline walked. Lukas is a name only.\n\nBWC DV stands here: Bedlam Woe’s Divine Vogue building. Not BBC. Not the island tower.\n\nIrad Stronge builds HVAC in Bridgeport and is never publicly linked. The night circuit keeps a team here. No Kindred court is locked. Do not seat one to make the map look even.",
    tags: ["Inland", "Brass City", "Holy Land", "BWC"],
    blanks: ["Lukas. Who holds the Brass City after the raid. Whether Holy Land stays empty."],
    people: [
      { id: "judas-kline", name: "Judas Kline", role: "Walked the raid" },
      { id: "lukas", name: "Lukas", role: "Name only" },
    ],
  },
  {
    id: "bwc-dv",
    name: "BWC DV",
    county: "New Haven",
    kind: "tower",
    x: 558,
    y: 70,
    r: 8,
    label: "right",
    parent: "waterbury",
    summary: "Bedlam Woe · Divine Vogue. Waterbury. Not the island tower, not BBC.",
    body: "Bedlam Woe Corporation Divine Vogue. The Brass City needle. DV is Divine Vogue — the same two letters as the Midtown media brand, a different corporation.\n\nThis is not BWC DA. Delta Atlantic is on the Gilded Shroud, Silent Island: 2,666 ft, docking ring, UAP. This is not BBC DVDA. That is Bridgeport Bulletin’s 1,666-ft purple HQ in Midtown.\n\nHeight, crown, and what the floors actually do are not in the packet. Do not copy the island specs onto this building to look finished.",
    tags: ["Tower", "BWC", "Divine Vogue", "Waterbury"],
    blanks: ["Height. Crown. Who occupies it. Whether Holy Land can see it from the hill."],
    people: [],
  },
];

export const SHORE_OFFMAP = {
  id: "new-york",
  name: "New York",
  summary: "Off this chart on purpose.",
  body: "New York by Night is a different scale. A Camarilla megacity (Black Empire / Kings of New York) will eat this desk if you draw it as a ninth town next to Stratford.\n\nKeep it as a direction — west-southwest across the Sound, past Long Island — until there is a domain packet with districts, storms, and who holds which block. Then it gets its own theater, the same way the island did.\n\nDo not put Manhattan on an East Fairfield map. The lie of distance is worse than a blank.",
};

export function shoreTown(id: string) {
  const canonical = id === "bbc-da" ? "bbc-dvda" : id;
  return SHORE_TOWNS.find((t) => t.id === canonical);
}

export function searchShore(q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  const da = t === "bbc da" || t === "bbcda" || t === "da";
  return SHORE_TOWNS.filter((s) => {
    if (da && (s.id === "bbc-dvda" || s.tags.includes("BBC DA"))) return true;
    return (
      s.id.toLowerCase().includes(t) ||
      s.name.toLowerCase().includes(t) ||
      s.county.toLowerCase().includes(t) ||
      s.summary.toLowerCase().includes(t) ||
      s.tags.some((tag) => tag.toLowerCase().includes(t))
    );
  });
}

export function shoreChildren(id: string) {
  return SHORE_TOWNS.filter((t) => t.parent === id);
}
