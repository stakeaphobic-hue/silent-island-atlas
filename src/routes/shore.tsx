import { createFileRoute } from "@tanstack/react-router";
import { ShoreApp } from "@/components/shore/ShoreApp";

export type ShoreSearch = {
  town?: string;
};

export const Route = createFileRoute("/shore")({
  validateSearch: (raw: Record<string, unknown>): ShoreSearch => ({
    town: typeof raw.town === "string" ? raw.town : undefined,
  }),
  component: ShorePage,
});

function ShorePage() {
  return <ShoreApp />;
}
