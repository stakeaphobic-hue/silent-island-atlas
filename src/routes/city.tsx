import { createFileRoute } from "@tanstack/react-router";
import { CityApp } from "@/components/city/CityApp";

export type CitySearch = {
  place?: string;
};

export const Route = createFileRoute("/city")({
  validateSearch: (raw: Record<string, unknown>): CitySearch => ({
    place: typeof raw.place === "string" ? raw.place : undefined,
  }),
  component: CityPage,
});

function CityPage() {
  return <CityApp />;
}
