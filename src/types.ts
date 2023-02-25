export type ColorObject = {
    color: string;
    opacity: number;
};

export type ColorSet = Array<ColorObject[]>;

export type PaletteType = {
    background: string;
    accent: string;
    accentDark: string;
    pencilColor: string;
    name?: string;
    blendMode?: GlobalCompositeOperation;

    trianglesColor: string;
    stripLinesColor: string;

    colorsA: ColorObject[];
    colorsB: ColorObject[];
    colorsC: ColorObject[];
    colorsD: ColorObject[];

    isDark?: boolean;
};
