import { create } from "zustand";

export type ChapterId =
  | "prologue"
  | "dawn"
  | "calendar"
  | "scale"
  | "pale"
  | "dust"
  | "worlds"
  | "letter"
  | "end";

type CosmosState = {
  chapter: ChapterId;
  scale: number;
  bangToken: number;
  pointerX: number;
  pointerY: number;
  sound: boolean;
  setChapter: (chapter: ChapterId) => void;
  setScale: (scale: number) => void;
  replayBang: () => void;
  setPointer: (pointerX: number, pointerY: number) => void;
  setSound: (sound: boolean) => void;
};

export const useCosmos = create<CosmosState>((set) => ({
  chapter: "prologue",
  scale: 4,
  bangToken: 0,
  pointerX: 0,
  pointerY: 0,
  sound: false,
  setChapter: (chapter) => set({ chapter }),
  setScale: (scale) => set({ scale }),
  replayBang: () => set((s) => ({ bangToken: s.bangToken + 1 })),
  setPointer: (pointerX, pointerY) => set({ pointerX, pointerY }),
  setSound: (sound) => set({ sound }),
}));
