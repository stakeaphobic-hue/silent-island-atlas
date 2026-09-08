import { useEffect } from "react";
import { AppHeader } from "@/components/shell/AppHeader";
import { Button } from "@/components/ui/button";
import { GateWorld } from "@/components/sww/GateWorld";
import { TouchStick } from "@/components/sww/TouchStick";
import { useEstateInput } from "@/components/sww/estate-input";

export function EstateApp() {
  const playing = useEstateInput((s) => s.playing);
  const night = useEstateInput((s) => s.night);
  const setPlaying = useEstateInput((s) => s.setPlaying);
  const setNight = useEstateInput((s) => s.setNight);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyN" && !e.repeat) setNight((n) => !n);
      if (e.code === "Escape") setPlaying(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setNight, setPlaying]);

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-ink text-paper">
      <AppHeader
        search=""
        onSearch={() => undefined}
        searchLabel=""
        hideSearch
        title="Slippery When Wet"
        kicker="Phantasmagoric Estate · front axis lock"
        extra={
          <Button type="button" size="sm" variant={night ? "default" : "secondary"} onClick={() => setNight((n) => !n)}>
            {night ? "Night face" : "Fog face"}
          </Button>
        }
      />
      <div className="relative min-h-0 flex-1 touch-none overflow-hidden">
        <GateWorld playing={playing} night={night} />
        {!playing ? (
          <button
            type="button"
            className="absolute inset-0 z-10 flex items-center justify-center bg-ink/55 text-left"
            onClick={() => setPlaying(true)}
          >
            <span className="mx-4 max-w-md rounded-xl bg-elevated px-6 py-5 shadow-border">
              <span className="block font-display text-2xl tracking-tight">Walk the front axis</span>
              <span className="mt-2 block text-sm leading-relaxed text-muted">
                Gates, checkerboard, fountain, tower window, paired doors. Click to look. WASD to walk. N
                flips the night face.
              </span>
              <span className="mt-3 block text-xs text-brass">Tap or click to enter</span>
            </span>
          </button>
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-3 sm:p-4">
          <p className="max-w-[16rem] text-xs text-paper/90 sm:max-w-sm">
            {night ? "Night face. Blood in the basin. Seal on the court." : "The yellow window is watching."}
          </p>
          <p className="hidden text-xs text-muted sm:block">WASD · look · Shift sprint · N night · Esc leave</p>
        </div>
        <TouchStick active={playing} />
      </div>
    </div>
  );
}
