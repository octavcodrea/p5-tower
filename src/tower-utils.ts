import p5 from "p5";
import { Grid, GridLayer, TileSet } from "./types";
import { sr, sre } from "./utils/common";

export const createGridLayer = (
    p5: p5,
    seed: string,
    tileset: TileSet,
    colors: p5.Color[]
): GridLayer => {
    const gridLayer: GridLayer = {
        ySize: 1,
        tiles: [],
    };

    let numberOfTiles = Math.floor(sr(seed) * 10 + 6);
    if (numberOfTiles % 2 === 0) {
        numberOfTiles++;
    }

    const middleTiles = numberOfTiles - 2;
    gridLayer.ySize = tileset.ySize;

    gridLayer.tiles.push({
        xIndex: 0,
        yIndex: 0,
        x: 0,
        y: 0,
        xSize: tileset.leftEdge.xSize,
        ySize: tileset.ySize,
        image: tileset.leftEdge.image,
        colors: colors,
    });

    for (let i = 0; i < middleTiles; i++) {
        let tile = tileset.middle[0];

        if (tileset.middle.length > 1) {
            if (i % tileset.middle.length === 0) {
                tile = tileset.middle[tileset.middle.length - 1];
            } else {
                tile = tileset.middle[i % tileset.middle.length];
            }
        }

        gridLayer.tiles.push({
            xIndex: i + 1,
            yIndex: 0,
            x: tileset.leftEdge.xSize + i * tile.xSize,
            y: 0,
            xSize: tile.xSize,
            ySize: tile.ySize,
            image: tile.image,
            colors: colors,
        });
    }

    gridLayer.tiles.push({
        xIndex: numberOfTiles - 1,
        yIndex: 0,
        x: 0,
        y: 0,
        xSize: tileset.rightEdge.xSize,
        ySize: tileset.ySize,
        image: tileset.rightEdge.image,
        colors: colors,
    });

    return gridLayer;
};

export const addGridLayer = (
    grid: Grid,
    gridLayer: GridLayer,
    tileSize: number,
    canvasWidth: number,
    canvasHeight: number
) => {
    const layer = {
        ...gridLayer,
        yIndex: grid.length,
        y: grid.length * gridLayer.ySize * tileSize,

        tiles: gridLayer.tiles.map((tile) => {
            let xPos = canvasWidth / 2;

            if (tile.xIndex < gridLayer.tiles.length / 2) {
                xPos =
                    canvasWidth / 2 -
                    (gridLayer.tiles.length / 2 - tile.xIndex) * tileSize;
            } else if (tile.xIndex > gridLayer.tiles.length / 2) {
                xPos =
                    canvasWidth / 2 +
                    (tile.xIndex - gridLayer.tiles.length / 2) * tileSize;
            }

            let yPos = 0;
            if (grid.length > 0 && grid[grid.length - 1].y !== undefined) {
                yPos =
                    // @ts-ignore
                    grid[grid.length - 1].y +
                    grid[grid.length - 1].ySize * tileSize;
            }

            console.log("fmm:", tile.xIndex, tile.yIndex, xPos, yPos);

            return {
                ...tile,
                x: xPos,
                y: yPos,
            };
        }),
    };
    console.log("fmm:", layer.tiles.length);

    grid.push(layer);
};
