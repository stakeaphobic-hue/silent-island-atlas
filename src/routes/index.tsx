import { createFileRoute } from "@tanstack/react-router";
import { AtlasApp } from "@/components/atlas/AtlasApp";
import type { CountyId } from "@/data/island";

const COUNTIES = new Set<CountyId>(["weirding", "silent", "eerier", "countess"]);

export type ChartSearch = {
  place?: string;
  county?: CountyId;
  view?: "fronts";
  front?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (raw: Record<string, unknown>): ChartSearch => ({
    place: typeof raw.place === "string" ? raw.place : undefined,
    county:
      typeof raw.county === "string" && COUNTIES.has(raw.county as CountyId)
        ? (raw.county as CountyId)
        : undefined,
    view: raw.view === "fronts" ? "fronts" : undefined,
    front: typeof raw.front === "string" ? raw.front : undefined,
  }),
  component: Home,
});

function Home() {
  return <AtlasApp />;
}
