import { asset } from "@/lib/utils";

export const PORTRAITS: Record<string, string> = {
  "acadia-leblanc": "/portraits/acadia-leblanc.jpg",
  "antonio-fontana": "/portraits/antonio-fontana.jpg",
  "atalanta-elouise-leblanc": "/portraits/atalanta-elouise-leblanc.jpg",
  "ayame": "/portraits/ayame.jpg",
  "bella-morales": "/portraits/bella-morales.jpg",
  "cheri-savona": "/portraits/cheri-savona.jpg",
  "cordelia": "/portraits/cordelia.jpg",
  "dante-cross": "/portraits/dante-cross.jpg",
  "daphne-big-d-remer": "/portraits/daphne-big-d-remer.jpg",
  "elouise-leblanc": "/portraits/elouise-leblanc.jpg",
  "envy-devareaux-pandemonium": "/portraits/envy-devareaux-pandemonium.jpg",
  "gina-fontana": "/portraits/gina-fontana.jpg",
  "isabeau": "/portraits/isabeau.jpg",
  "liora-voss": "/portraits/liora-voss.jpg",
  "lucan": "/portraits/lucan.jpg",
  "monica-vale": "/portraits/monica-vale.jpg",
  "natasha-volkov": "/portraits/natasha-volkov.jpg",
  "nicholas-vega": "/portraits/nicholas-vega.jpg",
  "nicole-devareaux": "/portraits/nicole-devareaux.jpg",
  "polonia": "/portraits/polonia.jpg",
  "priscilla-valentine-actual": "/portraits/priscilla-valentine-actual.jpg",
  "siobhan-o-rourke-immortal": "/portraits/siobhan-o-rourke-immortal.jpg",
  "spinadora-fiodora": "/portraits/spinadora-fiodora.jpg",
  "vaughn-merlot": "/portraits/vaughn-merlot.jpg",
  "veronique-blackstone": "/portraits/veronique-blackstone.jpg",
  "yvette-denslow": "/portraits/yvette-denslow.jpg",
  "zahra": "/portraits/zahra.jpg",
};

export function portraitOf(id: string) {
  const src = PORTRAITS[id];
  return src ? asset(src) : undefined;
}
