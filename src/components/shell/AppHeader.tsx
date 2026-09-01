import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Compass, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AppHeader({
  search,
  onSearch,
  searchLabel,
  extra,
  title = "Silent Island Atlas",
  kicker = "Island · Shore · Bay · Roster",
}: {
  search: string;
  onSearch: (v: string) => void;
  searchLabel: string;
  extra?: ReactNode;
  title?: string;
  kicker?: string;
}) {
  return (
    <header className="flex min-w-0 shrink-0 items-center gap-2 overflow-x-auto border-b border-border px-3 py-3 sm:gap-3 sm:px-4">
      <Compass className="size-5 shrink-0 text-brass" />
      <div className="hidden min-w-0 sm:block">
        <h1 className="font-display text-lg font-medium leading-none tracking-tight md:text-xl">
          {title}
        </h1>
        <p className="mt-1 hidden text-xs text-muted md:block">{kicker}</p>
      </div>
      <nav className="flex shrink-0 items-center gap-1 rounded-full bg-elevated p-1 shadow-border">
        <Link
          to="/"
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted hover:text-paper"
          activeOptions={{ exact: true }}
          activeProps={{ className: "bg-paper text-ink hover:text-ink" }}
        >
          Island
        </Link>
        <Link
          to="/shore"
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted hover:text-paper"
          activeProps={{ className: "bg-paper text-ink hover:text-ink" }}
        >
          Shore
        </Link>
        <Link
          to="/bay"
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted hover:text-paper"
          activeProps={{ className: "bg-paper text-ink hover:text-ink" }}
        >
          Bay
        </Link>
        <Link
          to="/roster"
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted hover:text-paper"
          activeProps={{ className: "bg-paper text-ink hover:text-ink" }}
        >
          <Users className="size-3.5" />
          Roster
        </Link>
      </nav>
      <div className="hidden min-w-0 flex-1 md:block">
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchLabel}
          aria-label={searchLabel}
        />
      </div>
      {extra}
    </header>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3 text-xs font-medium shadow-border transition-colors duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)]",
        active ? "bg-paper text-ink" : "bg-elevated text-muted",
      )}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
