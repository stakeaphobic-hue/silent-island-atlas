import { useRef } from "react";
import { useEstateInput } from "@/components/sww/estate-input";

function radial(dx: number, dy: number, r: number) {
  const m = Math.hypot(dx, dy);
  if (m < 8) return { x: 0, y: 0 };
  const s = Math.min(1, m / r);
  return { x: (dx / m) * s, y: (dy / m) * s };
}

export function TouchStick({ active }: { active: boolean }) {
  const setMove = useEstateInput((s) => s.setMove);
  const setLook = useEstateInput((s) => s.setLook);
  const origin = useRef({ x: 0, y: 0, id: -1, side: "move" as "move" | "look" });

  if (!active) return null;

  function start(side: "move" | "look", e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    origin.current = { x: e.clientX, y: e.clientY, id: e.pointerId, side };
  }
  function move(e: React.PointerEvent) {
    if (e.pointerId !== origin.current.id) return;
    const v = radial(e.clientX - origin.current.x, e.clientY - origin.current.y, 48);
    if (origin.current.side === "move") setMove(v.x, -v.y);
    else setLook(v.x, v.y);
  }
  function end(e: React.PointerEvent) {
    if (e.pointerId !== origin.current.id) return;
    origin.current.id = -1;
    if (origin.current.side === "move") setMove(0, 0);
    else setLook(0, 0);
  }

  const pad =
    "pointer-events-auto flex size-24 items-center justify-center rounded-full bg-elevated/80 shadow-border sm:hidden";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 z-30 flex justify-between px-4 sm:hidden">
      <button
        type="button"
        aria-label="Move"
        className={pad}
        onPointerDown={(e) => start("move", e)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <span className="size-8 rounded-full bg-paper/40" />
      </button>
      <button
        type="button"
        aria-label="Look"
        className={pad}
        onPointerDown={(e) => start("look", e)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <span className="size-8 rounded-full bg-brass/50" />
      </button>
    </div>
  );
}
