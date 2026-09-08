import { createFileRoute } from "@tanstack/react-router";
import { EstateApp } from "@/components/sww/EstateApp";

export const Route = createFileRoute("/sww")({
  component: SwwPage,
});

function SwwPage() {
  return <EstateApp />;
}
