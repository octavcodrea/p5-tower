import p5 from "p5";

export type Rgba = { r: number; g: number; b: number; a: number };

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

export type Palette = {
    background: string;
    name?: string;

    hexColors: string[];
};

export type PaletteGroup = {
    name: string;
    palettes: string[];
};

export type GridTile = {
    xIndex: number;
    yIndex: number;

    x: number;
    y: number;

    xSize: number;
    ySize: number;

    image?: p5.Image;
    accentImage?: p5.Image;

    colors: p5.Color[];
    prevColors?: p5.Color[];
    nextColors?: p5.Color[];

    colors2: p5.Color[];
    colors3?: p5.Color[];

    dontGlitch?: boolean;
    mirroredX?: boolean;
    mirroredY?: boolean;
};

export type GridLayer = {
    ySize: number;
    tiles: GridTile[];

    yIndex?: number;
    y?: number;

    totalTilesWidth: number;
    shouldMatchPreviousWidth: boolean;
    shouldMatchNextWidth: boolean;
};

export type Tile = {
    id?: string;
    imageSrc: string;
    image?: p5.Image;

    accentImageSrc?: string;
    accentImage?: p5.Image;

    xSize: number;
    ySize: number;
    type:
        | "left-edge"
        | "middle"
        | "right-edge"
        | "corbel"
        | "ground-item"
        | "human"
        | "chain";
};

export type TileSet = {
    name: string;
    ySize: number;

    leftEdge: Tile;
    middle: Tile[];
    rightEdge: Tile;

    matchPreviousWidth: boolean;
    matchNextWidth: boolean;
    dontGlitch?: boolean;
};

export type Grid = GridLayer[];

export type GraphicTile = {
    xIndex: number;
    yIndex: number;
    zIndex: number;

    xPos: number;
    yPos: number;

    isUsed: boolean;
    layer: number;

    isHidden?: boolean;

    imageOriginX?: number;
    imageOriginY?: number;

    image?: HTMLImageElement;
    accentImage?: HTMLImageElement;

    size?: number;

    color: p5.Color;
    color2?: string;
    connectionCoords?: {
        x: number;
        y: number;
    };
    distanceFromMainCenter?: number;
    angleFromMainCenter?: number;
};

export type GraphicGridRow = Array<GraphicTile>;

export type GraphicGrid2D = Array<GraphicGridRow>;
