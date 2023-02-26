import p5 from "p5";

export type ColorObject = {
    color: string;
    opacity: number;
};

export type ColorSet = Array<ColorObject[]>;

// export type PaletteType = {
//     background: string;
//     accent: string;
//     accentDark: string;
//     pencilColor: string;
//     name?: string;
//     blendMode?: GlobalCompositeOperation;

//     trianglesColor: string;
//     stripLinesColor: string;

//     colorsA: ColorObject[];
//     colorsB: ColorObject[];
//     colorsC: ColorObject[];
//     colorsD: ColorObject[];

//     isDark?: boolean;
// };

export type PaletteType = {
    background: string;
    name?: string;

    hexColors: string[];
};

export type GridTile = {
    xIndex: number;
    yIndex: number;

    x: number;
    y: number;

    xSize: number;
    ySize: number;

    image?: p5.Image;
    colors: p5.Color[];
};

export type GridLayer = {
    ySize: number;
    tiles: GridTile[];

    yIndex?: number;
    y?: number;
};

export type Tile = {
    imageSrc: string;
    image?: p5.Image;
    xSize: number;
    ySize: number;
    type: "left-edge" | "middle" | "right-edge";
};

export type TileSet = {
    name: string;
    ySize: number;

    leftEdge: Tile;
    middle: Tile[];
    rightEdge: Tile;
};

export type Grid = GridLayer[];
