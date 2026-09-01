import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Public asset path that respects Vite `base` (GitHub Pages subpath). */
export function asset(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const rel = path.replace(/^\//, "");
  return `${base}${rel}`;
}