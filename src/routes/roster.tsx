import { createFileRoute } from "@tanstack/react-router";
import { RosterView } from "@/components/roster/RosterView";

export type RosterSearch = {
  q?: string;
  desk?: string;
  splat?: string;
  id?: string;
  browse?: boolean;
};

export const Route = createFileRoute("/roster")({
  validateSearch: (raw: Record<string, unknown>): RosterSearch => ({
    q: typeof raw.q === "string" ? raw.q : undefined,
    desk: typeof raw.desk === "string" ? raw.desk : undefined,
    splat: typeof raw.splat === "string" ? raw.splat : undefined,
    id: typeof raw.id === "string" ? raw.id : undefined,
    browse: raw.browse === true || raw.browse === "1" || raw.browse === 1 ? true : undefined,
  }),
  component: RosterPage,
});

function RosterPage() {
  return <RosterView />;
}
