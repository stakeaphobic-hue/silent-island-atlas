export type FrontKind = "warlord" | "ambition" | "veil" | "landscape" | "bleed" | "blank";

export type Portent = {
  hour: number;
  text: string;
  done?: boolean;
  blank?: boolean;
};

export type FrontCast = {
  id: string;
  name: string;
  role: string;
};

export type Front = {
  id: string;
  name: string;
  kind: FrontKind;
  impulse: string;
  doom: string;
  clock: number;
  clockNote: string;
  ground: string;
  x: number;
  y: number;
  summary: string;
  body: string;
  portents: Portent[];
  blanks: string[];
  cast: FrontCast[];
  reach?: string[];
};

export const FRONTS: Front[] = [
  {
    id: "sleeper",
    name: "The Sleeper",
    kind: "landscape",
    impulse: "To be forgotten, and to make forgetting feel like weather.",
    doom: "The city wakes. History will not hold.",
    clock: 3,
    clockNote: "Stirring — fog heavier, the census is a lie.",
    ground: "Silent City. The alleged bed.",
    x: 400,
    y: 220,
    summary: "Landscape, not a prince. The island’s habit of swallowing maps, meals, and names.",
    body: "Public nights are boringly quiet. Census 800,013. Street-true: eight million, and the fog has a job. Over-hunting feeds it. The Harbingers want it to be Caine. The Watchers need it to stay down. This front does not care what you call it.",
    portents: [
      { hour: 3, text: "Fog heavier. New mainland money. The city feels more awake.", done: true },
      { hour: 6, text: "A street, a meal, or a name fails to stay put." },
      { hour: 9, text: "Cartographers and Kindred both start telling the truth by accident." },
      { hour: 12, text: "The bed is empty. Or it isn’t." },
    ],
    blanks: ["What it actually is. Do not lock Caine here just because someone preached it."],
    cast: [],
    reach: ["harbingers", "watchers", "bandidos"],
  },
  {
    id: "harbingers",
    name: "Harbingers of Blood",
    kind: "ambition",
    impulse: "To read a false Book until it becomes true.",
    doom: "Call to Gehenna. The Sleeper named as Caine and hauled up.",
    clock: 4,
    clockNote: "First geometry cut. The valve is slipping.",
    ground: "From the island. Aimed at Island City’s bowels — and at Bridgeport rubble.",
    x: 400,
    y: 430,
    summary: "Toxic Noddism. An 11-part ritual in sacred geometry, slow-burn into Season 1.",
    body: "Mostly vampires, originating on Silent Island. They believe Caine sleeps under the city and that they can wake him. The Watchers built them as a pressure valve. That valve is no longer under control.\n\nComponent 1 of 11 is done: the 76th Precinct, 2026-05-12. Forty-five actual dead. Sixty-six bodies planted. Public story: seventy-six, no survivors.",
    portents: [
      { hour: 3, text: "76th Precinct demolished. 66 planted. Black Temple asked of the Archbishop.", done: true },
      { hour: 6, text: "Scripture drip. Geometry visible on a map if you already know to look." },
      { hour: 9, text: "Palla Grande — October.", done: false },
      { hour: 12, text: "The Binding — December. Then Season 1, January 2027." },
    ],
    blanks: [
      "August and September on the Season 0 calendar — empty in the source. Leave them.",
      "The remaining 10 cuts of the geometry. Do not invent sites to look clever.",
    ],
    cast: [],
    reach: ["sleeper", "watchers", "shore"],
  },
  {
    id: "watchers",
    name: "The Watchers",
    kind: "veil",
    impulse: "To keep the Sleeper down, even if it costs the map.",
    doom: "The valve fails. The shrug stops working.",
    clock: 9,
    clockNote: "Still holding the cartographic lie. No longer holding the cult.",
    ground: "Everywhere the island is missing from a chart.",
    x: 36,
    y: 130,
    summary: "Technocracy. Why the island is a shrug. Why Kindred ‘know’ it is empty.",
    body: "They keep the Sleeper asleep. They made the Harbingers as a controllable pressure valve. The valve is no longer under control. The cover story — unclaimed city, boring nights, nothing to see in the Sound — is what Kindred keep repeating because the island makes people forget.",
    portents: [
      { hour: 6, text: "Kindred intel still says ‘no Sabbat, maybe a migration path.’", done: true },
      { hour: 9, text: "Harbingers off the leash. Bandidos already hold most of the counties.", done: true },
      { hour: 12, text: "Someone prints a true map." },
    ],
    blanks: ["Why this island, this bed, this much Technocracy attention. Do not fill it to be tidy."],
    cast: [],
    reach: ["sleeper", "harbingers"],
  },
  {
    id: "bandidos",
    name: "Los Bandidos de Mariel",
    kind: "warlord",
    impulse: "To hold the three counties and keep one eye on Bridgeport.",
    doom: "The Archbishop blesses a Black Temple on mainland rubble they made.",
    clock: 6,
    clockNote: "Forty years in. Eighty percent of the island. Temple contract underway.",
    ground: "East / West / Central counties. East County drydock offices. Haven on the island.",
    x: 36,
    y: 400,
    summary: "Ultra Conservative Sabbat coven. One of few packs in Island City. Not the rumor of ‘none as of yet.’",
    body: "Mariel, 1980. Interned, then a riot, then a cocaine empire. Pack bible (not the mainland CSV) seats Tony Fontana as Ductus — Brujah antitribu, 7th, Embraced April 1983. Nicholas Vega is the clean public face on the shore.\n\nThey demolished the 76th Precinct on Harbinger contract so the Archbishop would bless a Temple of Caine on the rubble. Open chair at the table: one brother unnamed.",
    portents: [
      { hour: 3, text: "Forty-year coven. ~80% of Weirding, Silent, Eerier.", done: true },
      { hour: 6, text: "76th down. Temple asked. Eyes on Bridgeport.", done: true },
      { hour: 9, text: "Archbishop’s blessing. Black Temple on the rubble." },
      { hour: 12, text: "The island pack and the shore empire stop pretending they are different jobs." },
    ],
    blanks: ["The unnamed brother. Weirding Immortal primary is also empty — do not seat either to be neat."],
    cast: [
      { id: "antonio-fontana", name: "Antonio “El Jefe” Fontana", role: "Ductus" },
      { id: "t-rodriguez", name: "T Rodriguez", role: "Priest" },
      { id: "carla-espinosa", name: "Carla Espinosa", role: "Abbot" },
      { id: "gina-fontana", name: "Gina Fontana", role: "Sister" },
      { id: "maddy-sparks", name: "Maddy Sparks", role: "Sister" },
      { id: "nicholas-vega", name: "Nicholas Vega", role: "Mainland face" },
    ],
    reach: ["sleeper", "harbingers", "shore", "immortals"],
  },
  {
    id: "immortals",
    name: "Old blood, seated",
    kind: "warlord",
    impulse: "To hold ground without becoming a court.",
    doom: "A Camarilla envoy invited to the Shroud — war, then forgetting.",
    clock: 2,
    clockNote: "Three seats filled. One county hungry.",
    ground: "The Gilded Shroud · Silent County · Eerier County.",
    x: 720,
    y: 210,
    summary: "Independent Immortals. Not Elysium. The Shroud only looks like one if you already belong.",
    body: "Baptiste “Baron” Delacroix holds the Gilded Shroud. Klaus Reinhardt holds Silent County. Siobhan O’Rourke holds Eerier. Weirding County has no Immortal primary. Leave it hungry.\n\nNo recognized Elysium. No prince. Adrienne Waters never held this island, and she is dead.",
    portents: [
      { hour: 2, text: "Three ground-holders. Shroud behaves like Elysium only to the invited.", done: true },
      { hour: 6, text: "A Camarilla probe treats the Grove like a city that wants a prince." },
      { hour: 12, text: "Someone seats Weirding. Or someone is unseated." },
    ],
    blanks: ["Weirding County Immortal primary — not yet seated."],
    cast: [
      { id: "baptiste-baron-delacroix", name: "Baptiste “Baron” Delacroix", role: "The Gilded Shroud" },
      { id: "klaus-reinhardt", name: "Klaus Reinhardt", role: "Silent County" },
      { id: "siobhan-o-rourke-immortal", name: "Siobhan O’Rourke", role: "Eerier County" },
    ],
    reach: ["bandidos", "sleeper"],
  },
  {
    id: "weirding-seat",
    name: "Weirding · unseated",
    kind: "blank",
    impulse: "To stay empty until play puts someone in it.",
    doom: "—",
    clock: 0,
    clockNote: "A blank. Not a mystery to solve tonight.",
    ground: "Weirding County.",
    x: 36,
    y: 260,
    summary: "Draw maps, leave blanks. This is one.",
    body: "No Immortal primary. The fog misbehaves. Roads shift. Wartime facilities were never truly abandoned. Do not invent a duke of Weirding to balance the other three.",
    portents: [],
    blanks: ["Who wants this county. Who the county will take."],
    cast: [],
    reach: ["immortals", "bandidos"],
  },
  {
    id: "shore",
    name: "Mainland bleed",
    kind: "bleed",
    impulse: "To point at the island without becoming the island.",
    doom: "Bridgeport’s Season 0 calendar finishes the geometry.",
    clock: 3,
    clockNote: "1 of 11 done. You are in late August. The source leaves August empty.",
    ground: "Bridgeport · East Fairfield. Dashed line across the Sound — not a colony.",
    x: 360,
    y: 40,
    summary: "BBC, Fontana’s clean face, a dead prince, a precinct that is now a question.",
    body: "Season 0 lives on the Connecticut shore and points at Silent Island. Adrienne Waters is dead. The Esbat is rubble (June). Camarilla agents are probing the mainland, not seated here.\n\nDo not colonize the island with Bridgeport plots. The shore is a front that bleeds. It is not a fourth county.",
    portents: [
      { hour: 3, text: "May: 76th explosion. June: Esbat obliterated. July: Blood Baths, land to the Archbishop.", done: true },
      { hour: 4, text: "August — empty in the source.", blank: true },
      { hour: 5, text: "September — empty in the source.", blank: true },
      { hour: 9, text: "October: Palla Grande." },
      { hour: 12, text: "December: The Binding." },
    ],
    blanks: [
      "August and September beats — do not fill to look prepared.",
    ],
    cast: [
      { id: "nicholas-vega", name: "Nicholas Vega", role: "City Planner · Fontana face" },
      { id: "monica-vale", name: "Monica Vale", role: "The Red Room" },
      { id: "bella-morales", name: "Bella Morales", role: "Crash Report" },
      { id: "antonio-fontana", name: "Antonio Fontana", role: "Operating face / Ductus" },
    ],
    reach: ["bandidos", "harbingers"],
  },
  {
    id: "unmapped",
    name: "Unmapped theaters",
    kind: "blank",
    impulse: "To stay off this chart until someone writes a district list.",
    doom: "—",
    clock: 0,
    clockNote: "Not a clock. A refusal.",
    ground: "New York by Night — Black Empire / Kings of New York.",
    x: 820,
    y: 40,
    summary: "PbtA: if you have no packet, you have a blank. Not a silhouette of Manhattan.",
    body: "New Haven now sits on the Shore chart. New York does not. A Camarilla megacity on an East Fairfield map would lie about distance and about what is known.\n\nLeave Kings of New York / Black Empire unmapped until a domain packet exists. Then it gets its own theater — the same way the shore just did.",
    portents: [],
    blanks: ["Districts. Storms. Who holds which block. Write that first."],
    cast: [],
    reach: ["shore"],
  },
];

export const FRONT_KINDS: { id: FrontKind; label: string }[] = [
  { id: "warlord", label: "Warlord" },
  { id: "ambition", label: "Ambition" },
  { id: "veil", label: "Veil" },
  { id: "landscape", label: "Landscape" },
  { id: "bleed", label: "Bleed" },
  { id: "blank", label: "Blank" },
];

export function frontById(id: string) {
  return FRONTS.find((f) => f.id === id);
}

export function searchFronts(q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return FRONTS.filter(
    (f) =>
      f.name.toLowerCase().includes(t) ||
      f.impulse.toLowerCase().includes(t) ||
      f.ground.toLowerCase().includes(t) ||
      f.summary.toLowerCase().includes(t) ||
      f.kind.includes(t),
  );
}
