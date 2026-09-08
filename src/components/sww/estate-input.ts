import { create } from "zustand";

type Probe = {
  getYaw: () => number;
  getSpeed: () => number;
  getX: () => number;
  getZ: () => number;
  setKeys: (codes: string[]) => void;
  setSteer?: (v: number) => void;
};

declare global {
  interface Window {
    __controlsTest?: Probe;
  }
}

type EstateInput = {
  playing: boolean;
  night: boolean;
  moveX: number;
  moveY: number;
  lookX: number;
  lookY: number;
  sprint: boolean;
  injected: string[] | null;
  setPlaying: (v: boolean) => void;
  setNight: (v: boolean | ((n: boolean) => boolean)) => void;
  setMove: (x: number, y: number) => void;
  setLook: (x: number, y: number) => void;
  setSprint: (v: boolean) => void;
  setInjected: (codes: string[] | null) => void;
};

export const useEstateInput = create<EstateInput>((set) => ({
  playing: false,
  night: false,
  moveX: 0,
  moveY: 0,
  lookX: 0,
  lookY: 0,
  sprint: false,
  injected: null,
  setPlaying: (playing) => set({ playing }),
  setNight: (v) => set((s) => ({ night: typeof v === "function" ? v(s.night) : v })),
  setMove: (moveX, moveY) => set({ moveX, moveY }),
  setLook: (lookX, lookY) => set({ lookX, lookY }),
  setSprint: (sprint) => set({ sprint }),
  setInjected: (injected) => set({ injected }),
}));
