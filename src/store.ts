import create from "zustand/vanilla";

type Store = {
    seed: string;
    newSeed: string;

    canvasWidth: number;
    canvasHeight: number;

    selectedPalette: number;
    devMode: boolean;
};

export const store = create<Store>((set) => ({
    seed: "0123456789012345",
    newSeed: "0123456789012345",

    canvasWidth: 24 * 3 * 26,
    canvasHeight: 24 * 4 * 26,

    selectedPalette: 0,
    devMode: true,
}));

export const { getState, setState, subscribe, destroy } = store;
