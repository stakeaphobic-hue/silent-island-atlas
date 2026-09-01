import { createFileRoute } from "@tanstack/react-router";
import { BayApp } from "@/components/bay/BayApp";

export type BaySearch = {
  place?: string;
};

export const Route = createFileRoute("/bay")({
  validateSearch: (raw: Record<string, unknown>): BaySearch => ({
    place: typeof raw.place === "string" ? raw.place : undefined,
  }),
  component: BayPage,
});

function BayPage() {
  return <BayApp />;
}
