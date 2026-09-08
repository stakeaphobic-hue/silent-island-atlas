/** Season 0 Time Line — ST desk lock 2026-09-08. Packet facts only. */

export type SeasonMonth = "May" | "June" | "July" | "August" | "September";
export type SeasonAtlas = "shore" | "city" | "island" | "fronts";

export type SeasonBeat = {
  id: string;
  date: string;
  month: SeasonMonth;
  title: string;
  atlas: SeasonAtlas;
  placeId: string;
  what: string;
  blank?: string;
  done: boolean;
};

export const SEASON0_CLOCK = "Early September 2026. Special elections in their last week.";

export const SEASON0: SeasonBeat[] = [
  {
    id: "may-76th",
    date: "2026-05-12",
    month: "May",
    title: "76th Precinct explodes",
    atlas: "shore",
    placeId: "precinct-76",
    what: "The 76th goes up. Mortal mystery as to who did it. Police will later file it as an accident.\n\nPrior lock still holds on the Kindred side: forty-five actual dead, sixty-six planted, public story seventy-six with no survivors. Los Bandidos de Mariel on Harbinger contract so a Temple of Caine can be asked of the Archbishop on the rubble.\n\nTony Fontana is Ductus and a Priscus who keeps the title hidden. Packmate Manny is a Paladin to Francisco Polonia and hides that too.",
    done: true,
  },
  {
    id: "jun-isabella-job",
    date: "2026-06-02",
    month: "June",
    title: "Isabella Flores evaluates Job",
    atlas: "shore",
    placeId: "bridgeport",
    what: "Priscus Isabella Flores visits the diocese to evaluate Job, who was recently given acknowledgement by Prisci Jake and Loki.",
    done: true,
  },
  {
    id: "jun-esbat",
    date: "2026-06-06",
    month: "June",
    title: "Esbat saved. Camarilla probe. Danesti retires.",
    atlas: "shore",
    placeId: "esbat",
    what: "Police close the 76th as an accident.\n\nCamarilla agents, upset over Prince Adrienne Waters, poke and test the city’s defenses.\n\nThe Esbat is wired to level. Danesti knows through sorcery. Mockingbird, Danesti, and other Cainites dismantle the explosives at the last moment. The Esbat is not rubble.\n\nTraced to Belco, a shell of Sebastian Rowlands. His name is now in circulation.\n\nWillow takes an aegis on leads from Gabriel, finds a Nosferatu mercenary. Cainites ambush that safehouse. Other mercenaries escape a second house that went uninvestigated. Danesti’s childe claims the Nosferatu’s blood for the Sabbat.\n\nArchbishop Danesti retires. Names Rook his successor. Polonia approves.",
    blank: "The uninvestigated second safehouse. Who Willow is on the desk (Gangrel sheet vs Ryder).",
    done: true,
  },
  {
    id: "jun-blood-bath",
    date: "2026-06-30",
    month: "June",
    title: "Rook’s Blood Bath. Toy Man.",
    atlas: "shore",
    placeId: "precinct-76",
    what: "76th on lockdown from the public. Construction begins. Site used for Archbishop Rook’s Blood Bath. Cardinal Francisco performs it.\n\nAfter-party: the Regent’s Paladin is murdered by a Protek hunter known only as the Toy Man — remote-control car delivering a weapon that bypasses disciplines, gifts, spheres, Arts. Cardinal has to be restrained by templars and paladins.\n\nCardinal conscripts Hilario Devareaux to replace a templar lost that night.",
    blank: "Toy Man’s real name. Which Paladin died. What the car actually carried.",
    done: true,
  },
  {
    id: "jul-shadowlands",
    date: "2026-07-03",
    month: "July",
    title: "Holy Land squatters. Shadowlands citadel.",
    atlas: "island",
    placeId: "countess",
    what: "Human worshippers of Caine come from all over and squat Holy Land in Waterbury, waiting on the first Temple of Caine built for humans.\n\nAbe and Arabella in the Shadowlands, and the Koldun Thaddeus on a separate line, find strange activity between Silent Island and Dutchess Island. Source spelling is Dutchess. This desk maps Countess Island / Gilded Grove here — do not merge the names without a lock.\n\nA white citadel in barren land. Closing on it has been impossible. Periodic bursts of energy into the sky. Silver airships leave northeast, same heading as Dutchess.\n\nDutchess drydocks: not construction. Cargo containers. Spectres oversee wraith labor; most present without consent. A scaffolding-like structure climbs into an endless void. Abe and Arabella are still in the middle of this.",
    blank: "Whether Dutchess is Countess. What the citadel is. What the airships carry.",
    done: true,
  },
  {
    id: "jul-sid-naya",
    date: "2026-07-07",
    month: "July",
    title: "Sid Naya dies in interview",
    atlas: "shore",
    placeId: "esbat",
    what: "Sid Naya is captured at the Bridgeport Esbat by the Black Hand for information he has been spreading. He gets himself killed during the interview.",
    done: true,
  },
  {
    id: "jul-monroe",
    date: "2026-07-07",
    month: "July",
    title: "Monroe riot. Job told he will be Priscus.",
    atlas: "shore",
    placeId: "monroe",
    what: "In Monroe, a large influx of Romani travelers for a wedding of two families. Tony Fontana uses the blood to manipulate a murder. The families riot. Job Bratovitch is told he is being made Priscus, Blood Bath next week.",
    blank: "Which families.",
    done: true,
  },
  {
    id: "jul-scorched-hope",
    date: "2026-07-14",
    month: "July",
    title: "Job bathed at Scorched Hope",
    atlas: "shore",
    placeId: "scorched-hope",
    what: "Job is Blood Bathed at the ruins of the church the travelers burnt the previous week. Priscus Tony performs it and makes it official. The site is consecrated Scorched Hope.\n\nThe Cardinal — Ultra Conservative — will not do this for a Loyalist Priscus himself.",
    done: true,
  },
  {
    id: "aug-holy-land",
    date: "2026-08-01",
    month: "August",
    title: "Holy Land crisis averted",
    atlas: "shore",
    placeId: "holy-land",
    what: "Holy Land, Waterbury: an amusement park with the tenacity of an immortal. Swallowed by decades, spit back as a resetting paradox. It reincarnates and fits its surroundings as if nothing were out of the ordinary.\n\nFBI Waco-scale incident avoided. The Bureau walked with: Lily Oth, Hugo Grasberger, Edith Henry, Ordon Brujah, Vinny Turner, Sandy Lukowski, Vivian Miranda, and a fake Judas Kline — a body double. The real Judas is a ghoul owned by the Toreador Lukas.",
    blank: "What Holy Land resets into next. Whether the FBI still believes they have Judas.",
    done: true,
  },
  {
    id: "aug-three-heads",
    date: "2026-08-11",
    month: "August",
    title: "Three heads. Tablets. Clappers blackout.",
    atlas: "fronts",
    placeId: "three-mayors",
    what: "Decapitated heads of the Bridgeport, Waterbury, and Silent City mayors mounted on each city’s tallest building. Bodies not found.\n\nLocks: Joseph P. Gainim (Bridgeport), Paul K. Pernerowski, Jr. (Waterbury), Richard Vernon (Silent City). Tallest needles on this desk: BBC DP in Bridgeport, BWC DV in Waterbury, BWC DA in Silent City.\n\nBanishment to Nod tablet fragments planted at each site — fake Noddist revelations, Chronicles of Reckoning, alluding to a fuller book.\n\nBishop Brigette traces them to the Bridgeport 111th Precinct evidence locker. Weyland, impersonating Dana Lopez, retrieves them and hands them to the Noddist Abhartach, who pieces the passage.\n\nSame night: two Immortals clash at Bluefish Clappers BASEketball Stadium. One remains. The Quickening takes a transformer. One-mile blackout. Injuries in the dark coliseum.\n\nBishop Bethany and Templar Hilario investigate. A trickster posing as a Watcher trolls them with two names that will matter: the Watchers, and Immortals.",
    blank: "Which Immortal died. Toy Man / Protek overlap with Weyland. What the full book is besides this passage.",
    done: true,
  },
  {
    id: "sep-elections",
    date: "2026-09-08",
    month: "September",
    title: "Special elections — last week",
    atlas: "fronts",
    placeId: "elections",
    what: "Last week of special elections for the three empty chairs. Celebrities have heavy-handed the bids. Each ticket promises a new city anthem and a new leaf.\n\nBridgeport — Kris Rock (First of the Month, Bone Thugs-n-Harmony) vs Snake Blitzkin (Escape from New York).\n\nWaterbury — Piotor Steele (This Corrosion, Sisters of Mercy) vs Cleo Getz (Albatross, Corrosion of Conformity).\n\nSilent City — Rick Ocasick (Drive, Deaftones cover) vs Melinda Carlisle (Our Lips Are Sealed / Video Killed the Radio Star). Melinda lives at Shell Beach and runs the Ho-Ho’s Toy Drive.",
    done: false,
  },
  {
    id: "sep-shadowlands",
    date: "2026-09-08",
    month: "September",
    title: "Shadowlands shoreline uproar",
    atlas: "island",
    placeId: "countess",
    what: "Shadowlands of the Silent Sound shoreline have been in a bit of an uproar, hyped on an excess of energy that keeps dispersing. Same class of burst Abe, Arabella, and Thaddeus reported from the white citadel on 3 July. Do not merge Dutchess Island with Countess Island without a lock.",
    blank: "Whether Dutchess is Countess. What the energy is feeding.",
    done: false,
  },
  {
    id: "sep-holy-land-disappearances",
    date: "2026-09-12",
    month: "September",
    title: "Holy Land disappearances. Enter Trumbull.",
    atlas: "shore",
    placeId: "holy-land",
    what: "Date not locked: 12 Sep or 26 Sep.\n\nSquatters at Holy Land are in trouble. FBI pressure is down but the high-tech surveillance is still there. Three Tremere have been hiding on the hill since Waterbury’s Praxis was shattered by the Bridgeport diocese. Their rationed blood is gone. They have been picking off members of the cult.\n\nEnter Trumbull — the next beat is a heading, not a scene.",
    blank: "12 Sep vs 26 Sep. The three Tremere. What ‘Enter Trumbull’ actually is.",
    done: false,
  },
];

export const AUGUST_SOURCE =
  "Time Line Season 0 (2026) — 8-11: three mayors’ heads on the tallest buildings. Tablets of Banishment to Nod. Immortal dead at Clappers. 8-1 in person: Holy Land crisis averted.";

export const AUGUST_SITES = SEASON0.filter((b) => b.month === "August").map((b) => ({
  id: b.id,
  name: b.title,
  beat: b.id === "aug-holy-land" ? ("in-person" as const) : ("discord" as const),
  atlas: b.atlas,
  placeId: b.placeId,
  what: b.what,
  blank: b.blank ?? "",
}));

export const AUGUST_DEATH_PLACE_IDS = [
  "bridgeport",
  "waterbury",
  "clappers",
  "downtown",
  "silent-city",
  "bbc-dp",
  "bwc-dv",
  "bwc-da",
  "precinct-111",
] as const;

export const AUGUST_MAYORS = [
  { id: "joseph-p-gainim", name: "Joseph P. Gainim", city: "Bridgeport", placeId: "bridgeport", needle: "BBC DP" },
  { id: "paul-k-pernerowski-jr", name: "Paul K. Pernerowski, Jr.", city: "Waterbury", placeId: "waterbury", needle: "BWC DV" },
  { id: "richard-vernon", name: "Richard Vernon", city: "Silent City", placeId: "downtown", needle: "BWC DA" },
] as const;

export const ELECTION_TICKETS = [
  {
    city: "Bridgeport",
    placeId: "bridgeport",
    candidates: [
      { id: "kris-rock", name: "Kris Rock", anthem: "First of the Month — Bone Thugs-n-Harmony", note: "Controversial comedian. Fuck You, Kiss My Ass. Assumed sure thing." },
      { id: "snake-blitzkin", name: "Snake Blitzkin", anthem: "Escape from New York", note: "Street figure. Gets things done. Not to be fucked with." },
    ],
  },
  {
    city: "Waterbury",
    placeId: "waterbury",
    candidates: [
      { id: "piotor-steele", name: "Piotor Steele", anthem: "This Corrosion — Sisters of Mercy", note: "Retired Type O Positive. Wetters fan. Blood banks and children’s cancer." },
      { id: "cleo-getz", name: "Cleo Getz", anthem: "Albatross — Corrosion of Conformity", note: "West Coast accountant. Twenty years in WitSec. Money bought the door." },
    ],
  },
  {
    city: "Silent City",
    placeId: "downtown",
    candidates: [
      { id: "rick-ocasick", name: "Rick Ocasick", anthem: "Drive — covered by Deaftones", note: "Deaftones frontman. Party monster who now claims he is settled." },
      { id: "melinda-carlisle", name: "Melinda Carlisle", anthem: "Our Lips Are Sealed — The Ho-Ho’s; Video Killed the Radio Star — The Buggles", note: "68, looks 45. Panacea 1998. Retired to Shell Beach. Ho-Ho’s Toy Drive." },
    ],
  },
] as const;

export function season0At(placeId: string) {
  return SEASON0.filter((b) => b.placeId === placeId || relatedPlace(b.placeId, placeId));
}

function relatedPlace(beatPlace: string, placeId: string) {
  const map: Record<string, string[]> = {
    "precinct-76": ["bridgeport", "bbc-dp"],
    "precinct-111": ["bridgeport"],
    esbat: ["bridgeport"],
    clappers: ["bridgeport"],
    "holy-land": ["waterbury", "trumbull"],
    "scorched-hope": ["monroe"],
    monroe: ["scorched-hope"],
    "three-mayors": ["bridgeport", "waterbury", "downtown", "silent-city", "bbc-dp", "bwc-dv", "bwc-da", "clappers"],
    elections: ["bridgeport", "waterbury", "downtown", "silent-city", "shell-beach"],
    countess: ["gilded-shroud", "countess"],
  };
  return map[beatPlace]?.includes(placeId) ?? false;
}

export function isAugustDeathPlace(placeId: string) {
  return (AUGUST_DEATH_PLACE_IDS as readonly string[]).includes(placeId);
}

export function augustAt(placeId: string) {
  return AUGUST_SITES.filter((s) => s.placeId === placeId || relatedPlace(s.placeId, placeId));
}
