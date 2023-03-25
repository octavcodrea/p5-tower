import p5 from "p5";
import {
    GraphicGrid2D,
    Grid,
    GridTile,
    GridLayer,
    TileSet,
    Tile,
} from "./types";
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

    if (numberOfTiles < 3) {
        numberOfTiles = 3;
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
        accentImage: tileset.leftEdge.accentImage,
        colors: colors,
        colors2: colors,
        dontGlitch: tileset.dontGlitch,
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
            accentImage: tile.accentImage,
            colors: colors,
            colors2: colors,
            dontGlitch: tileset.dontGlitch,
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
        accentImage: tileset.rightEdge.accentImage,
        colors: colors,
        colors2: colors,
        dontGlitch: tileset.dontGlitch,
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

            // console.log("fmm:", tile.xIndex, tile.yIndex, xPos, yPos);

            return {
                ...tile,
                x: xPos,
                y: yPos,
            };
        }),
    };
    // console.log("fmm:", layer.tiles.length);

    grid.push(layer);
};

export const getTileColors = (
    numberOfTiles: number,
    tileIndex: number,
    palette: p5.Color[]
) => {
    const p = palette;
    const n = numberOfTiles >= 0 ? numberOfTiles : 0;

    if (Math.abs(n / 2 - tileIndex - 0.5) <= n / 3) {
        if (Math.abs(n / 2 - tileIndex - 0.5) <= n / 6) {
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

export const addMazeLine = (params: {
    grid: GraphicGrid2D;
    x: number;
    y: number;
    seed: string | number;
    horizontalTendency?: number;
    verticalTendency?: number;
}) => {
    const { grid, x, y, seed, horizontalTendency, verticalTendency } = params;
    let newGrid = grid;

    let currentX = x;
    let currentY = y;

    let canContinue = true;

    while (
        canContinue &&
        currentX < newGrid.length - 2 &&
        currentY < newGrid[0].length - 2 &&
        currentX > 2 &&
        currentY > 2
    ) {
        // console.log("currentX", currentX);
        // console.log("currentY", currentY);
        const directionsAvailable = [];

        if (
            newGrid[currentX - 1][currentY - 2] &&
            newGrid[currentX][currentY - 2] &&
            newGrid[currentX + 1][currentY - 2] &&
            newGrid[currentX - 1][currentY - 1] &&
            newGrid[currentX + 1][currentY - 1]
        ) {
            let canGoUp = true;

            const a = newGrid[currentX - 1][currentY - 2].isUsed;
            const b = newGrid[currentX][currentY - 2].isUsed;
            const c = newGrid[currentX + 1][currentY - 2].isUsed;
            const d = newGrid[currentX - 1][currentY - 1].isUsed;
            const e = newGrid[currentX + 1][currentY - 1].isUsed;

            if (b) {
                canGoUp = false;
            }

            if ((a && !b) || (!b && c)) {
                canGoUp = false;
            }

            if ((a && b && d) || (b && c && e)) {
                canGoUp = false;
            }

            if (canGoUp) {
                if (!verticalTendency) {
                    directionsAvailable.push("up");
                } else {
                    for (let i = 0; i < verticalTendency; i++) {
                        directionsAvailable.push("up");
                    }
                }
            }
        }

        if (
            newGrid[currentX - 1][currentY + 2] &&
            newGrid[currentX][currentY + 2] &&
            newGrid[currentX + 1][currentY + 2] &&
            newGrid[currentX - 1][currentY + 1] &&
            newGrid[currentX + 1][currentY + 1]
        ) {
            let canGoDown = true;

            const a = newGrid[currentX - 1][currentY + 2].isUsed;
            const b = newGrid[currentX][currentY + 2].isUsed;
            const c = newGrid[currentX + 1][currentY + 2].isUsed;
            const d = newGrid[currentX - 1][currentY + 1].isUsed;
            const e = newGrid[currentX + 1][currentY + 1].isUsed;

            if (b) {
                canGoDown = false;
            }

            if ((a && !b) || (!b && c)) {
                canGoDown = false;
            }

            if ((a && b && d) || (b && c && e)) {
                canGoDown = false;
            }

            if (canGoDown) {
                if (!verticalTendency) {
                    directionsAvailable.push("down");
                } else {
                    for (let i = 0; i < verticalTendency; i++) {
                        directionsAvailable.push("down");
                    }
                }
            }
        }

        if (
            newGrid[currentX - 2][currentY - 1] &&
            newGrid[currentX - 2][currentY] &&
            newGrid[currentX - 2][currentY + 1] &&
            newGrid[currentX - 1][currentY - 1] &&
            newGrid[currentX - 1][currentY + 1]
        ) {
            let canGoLeft = true;

            const a = newGrid[currentX - 2][currentY - 1].isUsed;
            const b = newGrid[currentX - 2][currentY].isUsed;
            const c = newGrid[currentX - 2][currentY + 1].isUsed;
            const d = newGrid[currentX - 1][currentY - 1].isUsed;
            const e = newGrid[currentX - 1][currentY + 1].isUsed;

            if (b) {
                canGoLeft = false;
            }

            if ((a && !b) || (!b && c)) {
                canGoLeft = false;
            }

            if ((a && b && d) || (b && c && e)) {
                canGoLeft = false;
            }

            if (canGoLeft) {
                if (!horizontalTendency) {
                    directionsAvailable.push("left");
                } else {
                    for (let i = 0; i < horizontalTendency; i++) {
                        directionsAvailable.push("left");
                    }
                }
            }
        }

        if (
            newGrid[currentX + 2][currentY - 1] &&
            newGrid[currentX + 2][currentY] &&
            newGrid[currentX + 2][currentY + 1] &&
            newGrid[currentX + 1][currentY - 1] &&
            newGrid[currentX + 1][currentY + 1]
        ) {
            let canGoRight = true;

            const a = newGrid[currentX + 2][currentY - 1].isUsed;
            const b = newGrid[currentX + 2][currentY].isUsed;
            const c = newGrid[currentX + 2][currentY + 1].isUsed;
            const d = newGrid[currentX + 1][currentY - 1].isUsed;
            const e = newGrid[currentX + 1][currentY + 1].isUsed;

            if (b) {
                canGoRight = false;
            }

            if ((a && !b) || (!b && c)) {
                canGoRight = false;
            }

            if ((a && b && d) || (b && c && e)) {
                canGoRight = false;
            }

            if (canGoRight) {
                if (!horizontalTendency) {
                    directionsAvailable.push("right");
                } else {
                    for (let i = 0; i < horizontalTendency; i++) {
                        directionsAvailable.push("right");
                    }
                }
            }
        }

        // console.log("directionsAvailable", directionsAvailable);

        if (directionsAvailable.length === 0) {
            canContinue = false;
        }

        if (canContinue) {
            const direction =
                directionsAvailable[
                    Math.floor(
                        sr(seed.toString() + currentX + currentY) *
                            directionsAvailable.length
                    )
                ];

            if (direction === "up") {
                newGrid[currentX][currentY - 1].isUsed = true;
                newGrid[currentX][currentY - 2].isUsed = true;
                currentY -= 2;
            }

            if (direction === "down") {
                newGrid[currentX][currentY + 1].isUsed = true;
                newGrid[currentX][currentY + 2].isUsed = true;
                currentY += 2;
            }

            if (direction === "left") {
                newGrid[currentX - 1][currentY].isUsed = true;
                newGrid[currentX - 2][currentY].isUsed = true;
                currentX -= 2;
            }

            if (direction === "right") {
                newGrid[currentX + 1][currentY].isUsed = true;
                newGrid[currentX + 2][currentY].isUsed = true;
                currentX += 2;
            }
        }
    }

    return newGrid;
};

export const startChain = (
    p5: p5,
    x: number,
    y: number,
    direction: "right-up" | "right-down" | "left-up" | "left-down",
    tileSize: number,
    colors: p5.Color[],
    loadedChainTiles: Tile[],
    chainsArray: GridTile[]
) => {
    const baseParams = {
        x: x,
        y: y,
        xIndex: 0,
        yIndex: 0,
        xSize: 1,
        ySize: 1,
    };

    switch (direction) {
        case "right-up": {
            chainsArray.push({
                ...baseParams,
                colors: getTileColors(1, 1, colors),
                colors2: getTileColors(1, 1, colors),
                image: loadedChainTiles.find((tile) => tile.id === "right-base")
                    ?.image,
            });

            let currentX = x + tileSize;
            let currentY = y - tileSize;

            while (currentX < p5.width + tileSize && currentY > -tileSize) {
                chainsArray.push({
                    ...baseParams,
                    x: currentX,
                    y: currentY,
                    colors: getTileColors(1, 1, colors),
                    colors2: getTileColors(1, 1, colors),
                    image: loadedChainTiles.find((tile) => tile.id === "right")
                        ?.image,
                });

                currentX += tileSize;
                currentY -= tileSize;
            }

            break;
        }

        case "left-up": {
            chainsArray.push({
                ...baseParams,
                colors: getTileColors(1, 1, colors),
                colors2: getTileColors(1, 1, colors),
                image: loadedChainTiles.find((tile) => tile.id === "left-base")
                    ?.image,
            });

            let currentX = x - tileSize;
            let currentY = y - tileSize;

            while (currentX > 2 * -tileSize && currentY > -tileSize) {
                chainsArray.push({
                    ...baseParams,
                    x: currentX,
                    y: currentY,
                    colors: getTileColors(1, 1, colors),
                    colors2: getTileColors(1, 1, colors),
                    image: loadedChainTiles.find((tile) => tile.id === "left")
                        ?.image,
                });

                currentX -= tileSize;
                currentY -= tileSize;
            }

            break;
        }

        case "right-down": {
            chainsArray.push({
                ...baseParams,

                colors: getTileColors(1, 1, colors),
                colors2: getTileColors(1, 1, colors),
                image: loadedChainTiles.find((tile) => tile.id === "right-base")
                    ?.image,
                mirroredY: true,
            });

            let currentX = x + tileSize;
            let currentY = y + tileSize;

            while (currentX < p5.width && currentY < p5.height) {
                chainsArray.push({
                    ...baseParams,
                    x: currentX,
                    y: currentY,
                    colors: getTileColors(1, 1, colors),
                    colors2: getTileColors(1, 1, colors),
                    image: loadedChainTiles.find((tile) => tile.id === "right")
                        ?.image,
                    mirroredY: true,
                });

                currentX += tileSize;
                currentY += tileSize;
            }

            break;
        }

        case "left-down": {
            chainsArray.push({
                ...baseParams,
                colors: getTileColors(1, 1, colors),
                colors2: getTileColors(1, 1, colors),
                image: loadedChainTiles.find((tile) => tile.id === "left-base")
                    ?.image,
                mirroredY: true,
            });

            let currentX = x - tileSize;
            let currentY = y + tileSize;

            while (currentX > -2 * tileSize && currentY < p5.height) {
                chainsArray.push({
                    ...baseParams,
                    colors: getTileColors(1, 1, colors),
                    colors2: getTileColors(1, 1, colors),
                    image: loadedChainTiles.find((tile) => tile.id === "left")
                        ?.image,
                    mirroredY: true,
                    x: currentX,
                    y: currentY,
                });

                currentX -= tileSize;
                currentY += tileSize;
            }

            break;
        }
    }
};
