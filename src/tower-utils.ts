import p5 from "p5";
import { Grid, GridLayer, TileSet } from "./types";
import { sr, sre } from "./utils/common";

export const createGridLayer = (params: {
    tileSize: number;
    p5: p5;
    seed: string;
    tileset: TileSet;
    colors: p5.Color[];
    previousLayerWidth?: number;
    shouldMatchPreviousWidth?: boolean;
}): GridLayer => {
    const {
        p5,
        tileSize,
        seed,
        tileset,
        colors,
        previousLayerWidth,
        shouldMatchPreviousWidth,
    } = params;

    const gridLayer: GridLayer = {
        ySize: 1,
        tiles: [],
        totalTilesWidth: 0,
        shouldMatchPreviousWidth: false,
        shouldMatchNextWidth: false,
    };

    let numberOfTiles = Math.floor(sr(seed) * 10 + 6);
    const anticipatedWidth = calculateTotalTilesWidth(numberOfTiles, tileset);

    if (anticipatedWidth > p5.width / tileSize) {
        const difference = anticipatedWidth - p5.width / tileSize;
        numberOfTiles -= Math.ceil(difference / 2);
    }

    if (previousLayerWidth !== undefined && shouldMatchPreviousWidth) {
        const matchingNumberOfTiles = getMatchingNumberOfTiles(
            previousLayerWidth,
            tileset
        );

        if (matchingNumberOfTiles <= p5.width / tileSize) {
            numberOfTiles = matchingNumberOfTiles;
        }
    }

    if (numberOfTiles % 2 === 0) {
        numberOfTiles++;
    }
    let totalWidth = 0;

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

    totalWidth += tileset.leftEdge.xSize;

    for (let i = 0; i < middleTiles; i++) {
        let tile = tileset.middle[0];

        // if (tileset.middle.length > 1) {
        //     if (i % tileset.middle.length === 0) {
        //         tile = tileset.middle[tileset.middle.length - 1];
        //     } else {
        //         tile = tileset.middle[i % tileset.middle.length];
        //     }
        // }

        if (tileset.middle.length > 1) {
            if (tileset.middle.length === 2) {
                if (i % 2 === 0) {
                    tile = tileset.middle[0];
                } else {
                    tile = tileset.middle[1];
                }
            }

            if (tileset.middle.length === 3) {
                if (i % 4 === 0) {
                    tile = tileset.middle[0];
                } else if (i % 4 === 1) {
                    tile = tileset.middle[1];
                } else if (i % 4 === 2) {
                    tile = tileset.middle[0];
                } else if (i % 4 === 3) {
                    tile = tileset.middle[2];
                }
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

        totalWidth += tile.xSize;
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

    totalWidth += tileset.rightEdge.xSize;

    gridLayer.totalTilesWidth = totalWidth;
    gridLayer.shouldMatchNextWidth = tileset.matchNextWidth;
    gridLayer.shouldMatchPreviousWidth = tileset.matchPreviousWidth;
    gridLayer.shouldMatchPreviousWidth = tileset.matchPreviousWidth;

    return gridLayer;
};

export const addGridLayer = (
    grid: Grid,
    gridLayer: GridLayer,
    tileSize: number,
    canvasWidth: number,
    canvasHeight: number
) => {
    // for every layer in the grid, add the ySize:
    let yPos = 0;
    for (let i = 0; i < grid.length; i++) {
        yPos += grid[i].ySize * tileSize;
    }

    let totalXTiles = 0;
    for (let i = 0; i < gridLayer.tiles.length; i++) {
        totalXTiles += gridLayer.tiles[i].xSize;
    }

    const xStartPoint = (canvasWidth - totalXTiles * tileSize) / 2;
    let currentX = xStartPoint;

    const layer = {
        ...gridLayer,
        yIndex: grid.length,
        y: yPos,

        tiles: gridLayer.tiles.map((tile) => {
            let xPos = xStartPoint;

            if (tile.xIndex > 0) {
                xPos = currentX;
            }
            currentX += tile.xSize * tileSize;

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

export const getTileColors = (
    numberOfTiles: number,
    tileIndex: number,
    palette: p5.Color[]
) => {
    const p = palette;
    if (Math.abs(numberOfTiles / 2 - tileIndex - 0.5) <= numberOfTiles / 3) {
        if (
            Math.abs(numberOfTiles / 2 - tileIndex - 0.5) <=
            numberOfTiles / 6
        ) {
            return p.slice(2);
        } else {
            return p.slice(1);
        }
    } else return p;
};

export function getMatchingNumberOfTiles(
    desiredWidth: number,
    tileset: TileSet
) {
    switch (tileset.middle.length) {
        case 1:
            return Math.floor(desiredWidth / tileset.middle[0].xSize);
        case 2: {
            if (tileset.middle[0].xSize === tileset.middle[1].xSize) {
                return Math.floor(desiredWidth / tileset.middle[0].xSize);
            } else {
                let numberOfTiles = 0;
                let currentWidth = 0;

                while (currentWidth < desiredWidth) {
                    if (numberOfTiles % 2 === 0) {
                        currentWidth += tileset.middle[0].xSize;
                    } else {
                        currentWidth += tileset.middle[1].xSize;
                    }
                    numberOfTiles++;
                }

                return numberOfTiles;
            }
        }
        case 3: {
            if (
                tileset.middle[0].xSize === tileset.middle[1].xSize &&
                tileset.middle[1].xSize === tileset.middle[2].xSize
            ) {
                return Math.floor(desiredWidth / tileset.middle[0].xSize);
            } else {
                let numberOfTiles = 0;
                let currentWidth = 0;

                while (currentWidth < desiredWidth) {
                    if (numberOfTiles % 4 === 0 || numberOfTiles % 4 === 2) {
                        currentWidth += tileset.middle[0].xSize;
                    } else if (numberOfTiles % 4 === 1) {
                        currentWidth += tileset.middle[1].xSize;
                    } else if (numberOfTiles % 4 === 3) {
                        currentWidth += tileset.middle[2].xSize;
                    }
                    numberOfTiles++;
                }

                return numberOfTiles;
            }
        }
        default:
            return Math.floor(desiredWidth / tileset.middle[0].xSize);
    }
}

export function calculateTotalTilesWidth(
    numberOfTiles: number,
    tileset: TileSet
) {
    let totalWidth = 0;

    totalWidth += tileset.leftEdge.xSize;

    for (let i = 0; i < numberOfTiles; i++) {
        let tile = tileset.middle[0];

        if (tileset.middle.length === 2) {
            if (i % 2 === 0) {
                tile = tileset.middle[0];
            } else {
                tile = tileset.middle[1];
            }
        }

        if (tileset.middle.length === 3) {
            if (i % 4 === 0) {
                tile = tileset.middle[0];
            } else if (i % 4 === 1) {
                tile = tileset.middle[1];
            } else if (i % 4 === 2) {
                tile = tileset.middle[0];
            } else if (i % 4 === 3) {
                tile = tileset.middle[2];
            }
        }

        totalWidth += tile.xSize;
    }

    totalWidth += tileset.rightEdge.xSize;

    return totalWidth;
}
