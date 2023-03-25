import P5 from "p5";
import noiseColor from "./assets/images/noise-color.png";
import noiseMono from "./assets/images/noise-mono.png";

import noiseColorSmall from "./assets/images/noise-color-small.png";
import noiseMonoSmall from "./assets/images/noise-mono-small.png";
import test1png from "./assets/images/test1.png";

import Palettes from "./assets/palettes";
import PaletteGroups from "./assets/palette-groups";

import { store } from "./store";
import { setupHtml, updateHtml } from "./utils";
import { drawingAgent, treetrunkAgent } from "./agents-ukiyoe";
import { drawImageWithBrushes, textVertical } from "./utils/p5utils";
import { tilesets } from "./assets/tilesets/tilesets";
import { corbelTiles } from "./assets/corbels/corbels";
import { chainTiles } from "./assets/chains/chains";
import { groundItemTiles } from "./assets/ground-items/ground-items";
import { humans } from "./assets/humans/humans";
import { GraphicGrid2D, Grid, GridTile, Tile, TileSet } from "./types";
import {
    addGridLayer,
    addMazeLine,
    createGridLayer,
    getTileColors,
    startChain,
} from "./tower-utils";

// @ts-ignore
import font1Source from "url:./assets/fonts/font1.ttf";
// @ts-ignore
import font2Source from "url:./assets/fonts/font2.ttf";
import {
    fcInt,
    getPaletteByName,
    roundDecimals,
    sr,
    sre,
    srInt,
    srn,
} from "./utils/common";

let { canvasWidth, canvasHeight } = store.getState();

const unit = canvasWidth / 1000;
let deltaTime = 0;

export function u(x: number) {
    if (typeof x === "number") {
        return x * unit;
    } else {
        console.error("Error. u() only accepts numbers");
        return 0;
    }
}

let grid: Grid = [];
let corbels: GridTile[] = [];
let groundItems: GridTile[] = [];
let human: GridTile | undefined = undefined;
let chains: GridTile[] = [];

let dotsDrawn = false;
let gridDrawn = false;
let corbelsDrawn = false;
let groundItemsDrawn = false;
let graphicGridDrawn = false;
let humanDrawn = false;
let chainsDrawn = false;
let allowedTilesets = tilesets;

let mainPalette = getPaletteByName(PaletteGroups[0].palettes[0]);

let secondaryPalette =
    PaletteGroups[0].palettes[0] !== undefined
        ? getPaletteByName(PaletteGroups[0].palettes[1])
        : mainPalette;

const sketch = (p5: P5) => {
    let seed = Math.floor(Math.random() * 1000000000000000).toString();
    let newSeed = seed;

    let charA = parseInt(seed[0] + seed[1]);
    let charB = parseInt(seed[2] + seed[3]);
    let charC = parseInt(seed[4] + seed[5]);
    let charD = parseInt(seed[6] + seed[7]);
    let charE = parseInt(seed[8] + seed[9]);
    let charF = parseInt(seed[10] + seed[11]);
    let charG = parseInt(seed[12] + seed[13]);
    let charH = parseInt(seed[14] + seed[15]);

    let seedA = charA.toString();
    let seedB = charB.toString();
    let seedC = charC.toString();
    let seedD = charD.toString();
    let seedE = charE.toString();
    let seedF = charF.toString();
    let seedG = charG.toString();
    let seedH = charH.toString();

    let selectedPaletteGroup = Math.floor(Palettes.length * (charD / 100));
    let font1: any = undefined;
    let font2: any = undefined;

    let graphicGrid: GraphicGrid2D = [];

    function setupFromSeed() {
        const seed = store.getState().seed;
        const ns = store.getState().newSeed;

        charA = parseInt(seed[0] + seed[1]);
        charB = parseInt(seed[2] + seed[3]);
        charC = parseInt(seed[4] + seed[5]);
        charD = parseInt(seed[6] + seed[7]);
        charE = parseInt(seed[8] + seed[9]);
        charF = parseInt(seed[10] + seed[11]);
        charG = parseInt(seed[12] + seed[13]);
        charH = parseInt(seed[14] + seed[15]);

        seedA = charA.toString();
        seedB = charB.toString();
        seedC = charC.toString();
        seedD = charD.toString();
        seedE = charE.toString();
        seedF = charF.toString();
        seedG = charG.toString();
        seedH = charH.toString();

        p5.noiseSeed(parseInt(seed));

        selectedPaletteGroup = Math.floor(PaletteGroups.length * (charD / 100));

        store.setState({ selectedPalette: selectedPaletteGroup });

        canvasWidth = store.getState().canvasWidth;
        canvasHeight = store.getState().canvasHeight;

        const htmlseed = document.getElementById("info-seed");
        if (htmlseed) {
            htmlseed.innerHTML = seed;
        }

        const htmlnewseed = document.getElementById("new-seed");
        if (htmlnewseed) {
            if (!document.getElementById("new-seed-input")) {
                const newSeedInput = document.createElement("input");
                newSeedInput.id = "new-seed-input";
                newSeedInput.value = ns;

                newSeedInput.addEventListener("change", (e) => {
                    // @ts-ignore
                    if (e.target && e.target.value) {
                        // @ts-ignore
                        newSeed = e.target.value;
                    }
                });

                htmlnewseed.appendChild(newSeedInput);
            } else {
                const newSeedInput = document.getElementById("new-seed-input");
                if (newSeedInput && newSeedInput instanceof HTMLInputElement) {
                    console.log("newSeedInput: ", newSeedInput);
                    newSeedInput.value = ns;
                }
            }
        }

        const htmlWidthInput = document.getElementById("canvas-width-input");
        if (htmlWidthInput && htmlWidthInput instanceof HTMLInputElement) {
            htmlWidthInput.value = canvasWidth.toString();
        }

        const htmlHeightInput = document.getElementById("canvas-height-input");
        if (htmlHeightInput && htmlHeightInput instanceof HTMLInputElement) {
            htmlHeightInput.value = canvasHeight.toString();
        }
    }

    setupFromSeed();

    let noiseImgColor: P5.Image;
    let noiseImgMono: P5.Image;

    let test1: P5.Image;

    let loadedTilesets: TileSet[] = [];
    let loadedCorbelTiles: Tile[] = [];
    let loadedGroundItemTiles: Tile[] = [];
    let loadedHumanTiles: Tile[] = [];
    let loadedChainTiles: Tile[] = [];

    const tileSize = 64;
    console.log("tileSize: ", tileSize);

    p5.preload = () => {
        noiseImgColor =
            p5.width < 1500
                ? p5.loadImage(noiseColorSmall)
                : p5.loadImage(noiseColor);
        noiseImgMono =
            p5.width < 1500
                ? p5.loadImage(noiseMonoSmall)
                : p5.loadImage(noiseMono);

        test1 = p5.loadImage(test1png);

        font1 = p5.loadFont(font1Source);
        font2 = p5.loadFont(font2Source);

        loadedTilesets = tilesets.map((tileset) => {
            const { leftEdge, rightEdge, middle, ...rest } = tileset;
            const loadedLeftEdge = {
                ...leftEdge,
                image: p5.loadImage(leftEdge.imageSrc),
                accentImage: leftEdge.accentImageSrc
                    ? p5.loadImage(leftEdge.accentImageSrc)
                    : undefined,
            };
            const loadedMiddle = middle.map((m) => {
                return {
                    ...m,
                    image: p5.loadImage(m.imageSrc),
                    accentImage: m.accentImageSrc
                        ? p5.loadImage(m.accentImageSrc)
                        : undefined,
                };
            });
            const loadedRightEdge = {
                ...rightEdge,
                image: p5.loadImage(rightEdge.imageSrc),
                accentImage: rightEdge.accentImageSrc
                    ? p5.loadImage(rightEdge.accentImageSrc)
                    : undefined,
            };

            return {
                ...rest,
                leftEdge: loadedLeftEdge,
                middle: loadedMiddle,
                rightEdge: loadedRightEdge,
            };
        });

        loadedCorbelTiles = corbelTiles.map((tile) => {
            return { ...tile, image: p5.loadImage(tile.imageSrc) };
        });

        loadedGroundItemTiles = groundItemTiles.map((tile) => {
            return { ...tile, image: p5.loadImage(tile.imageSrc) };
        });

        loadedHumanTiles = humans.map((human) => {
            return {
                ...human,
                image: p5.loadImage(human.imageSrc),
                accentImage: human.accentImageSrc
                    ? p5.loadImage(human.accentImageSrc)
                    : undefined,
            };
        });

        loadedChainTiles = chainTiles.map((chain) => {
            return {
                ...chain,
                image: p5.loadImage(chain.imageSrc),
                accentImage: chain.accentImageSrc
                    ? p5.loadImage(chain.accentImageSrc)
                    : undefined,
            };
        });

        store.setState({ selectedPalette: selectedPaletteGroup });
    };

    p5.setup = () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        p5.colorMode(p5.HSB, 360, 100, 100);
        p5.noStroke();
        p5.strokeCap(p5.ROUND);
        p5.angleMode(p5.RADIANS);

        function doSetup() {
            seed = store.getState().seed;
            grid = [];
            graphicGrid = [];
            corbels = [];
            groundItems = [];
            chains = [];
            human = undefined;

            p5.frameCount = 0;
            p5.loop();

            dotsDrawn = false;
            gridDrawn = false;
            corbelsDrawn = false;
            groundItemsDrawn = false;
            graphicGridDrawn = false;
            humanDrawn = false;
            chainsDrawn = false;

            allowedTilesets = [];

            while (allowedTilesets.length < 10) {
                const randomTileset =
                    loadedTilesets[
                        Math.floor(p5.random(loadedTilesets.length))
                    ];

                if (!allowedTilesets.includes(randomTileset)) {
                    allowedTilesets.push(randomTileset);
                }
            }

            p5.blendMode(p5.BLEND);

            p5.background(p5.color("#000").toString());

            // const c1 = p5.color("#000");
            // const c2 = p5.color("#222");

            // for (let y = 0; y < canvasHeight; y++) {
            //     const n = p5.map(y, 0, canvasHeight, 0, 1);
            //     let newc = p5.lerpColor(c1, c2, n);
            //     p5.stroke(newc);
            //     p5.line(0, y, canvasWidth, y);
            // }

            let previousLayerWidth = 0;
            let shouldMatchPreviousWidth = false;
            let shouldMatchNextWidth = false;

            mainPalette = getPaletteByName(
                PaletteGroups[selectedPaletteGroup].palettes[0]
            );

            secondaryPalette =
                PaletteGroups[selectedPaletteGroup].palettes[1] !== undefined
                    ? getPaletteByName(
                          PaletteGroups[selectedPaletteGroup].palettes[1]
                      )
                    : mainPalette;

            let prevTl: TileSet | undefined = undefined;

            for (let i = 0; i < 35; i++) {
                const prevTileset: TileSet | undefined = prevTl;

                let theseTilesets: TileSet[] = allowedTilesets.filter((t) => {
                    return (
                        (prevTileset && t.name !== prevTileset?.name) ||
                        !prevTileset
                    );
                });

                let thisTileset =
                    theseTilesets[
                        Math.floor(theseTilesets.length * sre(i, seed + i))
                    ];

                prevTl = thisTileset;

                if (thisTileset) {
                    shouldMatchPreviousWidth =
                        thisTileset.matchPreviousWidth || shouldMatchNextWidth;

                    const thisLayer = createGridLayer({
                        p5: p5,
                        seed: seed + i,
                        tileset: thisTileset,
                        colors: [],
                        previousLayerWidth: previousLayerWidth,
                        shouldMatchPreviousWidth: shouldMatchPreviousWidth,
                        tileSize: tileSize,
                    });

                    addGridLayer(
                        grid,
                        thisLayer,
                        tileSize,
                        p5.width,
                        p5.height
                    );

                    shouldMatchNextWidth = thisTileset.matchNextWidth;
                    previousLayerWidth = thisLayer.totalTilesWidth;
                }
            }

            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[i].tiles.length; j++) {
                    let thisTile = grid[i].tiles[j];

                    let mainPaletteToUse = mainPalette.hexColors.map((c) => {
                        return p5.color(c);
                    });

                    let secPaletteToUse = secondaryPalette.hexColors.map(
                        (c) => {
                            return p5.color(c);
                        }
                    );

                    thisTile.colors = getTileColors(
                        grid[i].tiles.length,
                        j,
                        mainPaletteToUse
                    );

                    thisTile.colors2 = getTileColors(
                        grid[i].tiles.length,
                        j,
                        secPaletteToUse
                    );

                    thisTile.prevColors = getTileColors(
                        grid[i].tiles.length,
                        j - 1,

                        mainPaletteToUse
                    );

                    thisTile.nextColors = getTileColors(
                        grid[i].tiles.length,
                        j + 1,

                        mainPaletteToUse
                    );

                    grid[i].tiles[j] = thisTile;
                }
            }

            // corbels
            for (let i = 0; i < grid.length - 3; i++) {
                if (grid[i].tiles && grid[i + 1].tiles && grid[i + 2].tiles) {
                    const thisLevel = grid[i].totalTilesWidth;
                    const nextLevel = grid[i + 1].totalTilesWidth;
                    // const nextNextLevel = grid[i + 2].totalTilesWidth;

                    if (
                        thisLevel >
                        nextLevel + 2
                        // &&
                        // thisLevel > nextNextLevel + 2
                    ) {
                        const difference = thisLevel - nextLevel;

                        for (let j = 1; j < grid[i].tiles.length - 1; j++) {
                            if (
                                j < difference / 2 ||
                                j > grid[i].tiles.length - difference / 2
                            ) {
                                switch (grid[i].tiles[j].xSize) {
                                    case 1:
                                    default: {
                                        if (sre(j, j + seed + i) < 0.2) {
                                            break;
                                        }
                                        const corbel =
                                            loadedCorbelTiles[
                                                Math.floor(
                                                    loadedCorbelTiles.length *
                                                        sre(j, j + seed + i)
                                                )
                                            ];

                                        corbels.push({
                                            xIndex: 0,
                                            yIndex: 0,
                                            x: grid[i].tiles[j].x,
                                            y:
                                                grid[i].tiles[j].y +
                                                grid[i].tiles[j].ySize *
                                                    tileSize,
                                            colors: grid[i].tiles[j].colors,
                                            colors2: grid[i].tiles[j].colors2,
                                            image: corbel.image,
                                            xSize: corbel.xSize,
                                            ySize: corbel.ySize,
                                        });
                                        break;
                                    }

                                    case 2:
                                    case 3: {
                                        for (
                                            let k = 0;
                                            k < grid[i].tiles[j].xSize;
                                            k++
                                        ) {
                                            if (
                                                sre(j, j + seed + i + k) < 0.3
                                            ) {
                                                continue;
                                            }

                                            const corbel =
                                                loadedCorbelTiles[
                                                    Math.floor(
                                                        loadedCorbelTiles.length *
                                                            sre(
                                                                j,
                                                                j + seed + i + k
                                                            )
                                                    )
                                                ];

                                            corbels.push({
                                                xIndex: 0,
                                                yIndex: 0,
                                                x:
                                                    grid[i].tiles[j].x +
                                                    k * tileSize,
                                                y:
                                                    grid[i].tiles[j].y +
                                                    grid[i].tiles[j].ySize *
                                                        tileSize,
                                                colors: grid[i].tiles[j].colors,
                                                colors2:
                                                    grid[i].tiles[j].colors2,
                                                image: corbel.image,
                                                xSize: corbel.xSize,
                                                ySize: corbel.ySize,
                                            });
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // ground item tiles
            for (let i = 2; i < grid.length; i++) {
                if (grid[i].tiles && grid[i - 1].tiles) {
                    const thisLevel = grid[i].totalTilesWidth;
                    const prevLevel = grid[i - 1].totalTilesWidth;
                    const prevPrevLevel = grid[i - 2].totalTilesWidth;

                    const prevLevelDifference = thisLevel - prevLevel;
                    const prevPrevLevelDifference = thisLevel - prevPrevLevel;

                    let humanOnThisLevel = false;

                    if (thisLevel > prevLevel) {
                        const difference = thisLevel - prevLevel + 2;

                        for (let j = 1; j < grid[i].tiles.length - 1; j++) {
                            const thisTile = grid[i].tiles[j];

                            for (let k = 0; k < thisTile.xSize; k++) {
                                if (sre(j, j + seed + i) > 0.5) {
                                    const groundItemTile =
                                        loadedGroundItemTiles[
                                            Math.floor(
                                                loadedGroundItemTiles.length *
                                                    sre(
                                                        j + i + k,
                                                        j + seed + i + k
                                                    )
                                            )
                                        ];

                                    if (
                                        j < difference / 2 ||
                                        j >
                                            grid[i].tiles.length -
                                                difference / 2
                                    ) {
                                        groundItems.push({
                                            xIndex: 0,
                                            yIndex: 0,
                                            x:
                                                grid[i].tiles[j].x +
                                                // ((grid[i].tiles[j].xSize - 1) / 2) *
                                                //     tileSize,
                                                k *
                                                    groundItemTile.xSize *
                                                    tileSize,
                                            y:
                                                grid[i].tiles[j].y -
                                                tileSize * groundItemTile.ySize,
                                            colors: grid[i].tiles[j].colors,
                                            colors2: grid[i].tiles[j].colors2,
                                            image: groundItemTile.image,
                                            xSize: groundItemTile.xSize,
                                            ySize: groundItemTile.ySize,
                                        });
                                    }
                                }
                            }
                        }
                    }

                    // human
                    if (
                        thisLevel > prevLevel &&
                        prevLevelDifference > 4 &&
                        thisLevel > prevPrevLevel &&
                        prevPrevLevelDifference > 4
                    ) {
                        const difference = Math.min(
                            thisLevel - prevLevel,
                            thisLevel - prevPrevLevel
                        );

                        const thisLevelY = grid[i].tiles[0].y;
                        console.log(
                            p5.height * 0.3,
                            p5.height * 0.6,
                            "thisLevelY",
                            thisLevelY,
                            tileSize * 6,
                            p5.height * 0.3 - thisLevelY,
                            p5.height * 0.6 - thisLevelY
                        );

                        if (
                            Math.abs(p5.height * 0.33 - thisLevelY) <
                                tileSize * 6 ||
                            Math.abs(p5.height * 0.66 - thisLevelY) <
                                tileSize * 6
                        ) {
                            const humanTile =
                                loadedHumanTiles[
                                    Math.floor(
                                        loadedHumanTiles.length *
                                            sre(i, i + seed + i)
                                    )
                                ];

                            const xOffset = (difference / 4) * tileSize;

                            const leftOrRight = sre(i, i + seed + i) < 0.5;
                            let humanImg = humanTile.image;
                            let humanAccentImg = humanTile.accentImage;

                            human = {
                                xIndex: 0,
                                yIndex: 0,
                                x: leftOrRight
                                    ? grid[i].tiles[grid[i].tiles.length - 1]
                                          .x - xOffset
                                    : grid[i].tiles[0].x + xOffset,
                                y:
                                    grid[i].tiles[2].y -
                                    tileSize * humanTile.ySize,
                                colors: grid[i].tiles[2].colors,
                                colors2: grid[i].tiles[2].colors2,
                                image: humanImg,
                                accentImage: humanAccentImg,
                                xSize: humanTile.xSize,
                                ySize: humanTile.ySize,
                                mirroredX: leftOrRight,
                            };

                            console.log("human", human);
                        }
                    }

                    if (!humanOnThisLevel) {
                        humanOnThisLevel = true;
                    }

                    const baseTileStart = grid[i].tiles[0];
                    const baseTileEnd = grid[i].tiles[grid[i].tiles.length - 1];

                    //@ts-ignore
                    if (grid[i].y && grid[i].y < p5.height * 0.5) {
                        if (
                            thisLevel > prevLevel &&
                            prevLevelDifference > 2 &&
                            thisLevel > prevPrevLevel &&
                            prevPrevLevelDifference > 2
                        ) {
                            startChain(
                                p5,
                                baseTileEnd.x - tileSize,
                                baseTileEnd.y - tileSize - (tileSize / 16) * 4,
                                "right-up",
                                tileSize,
                                mainPalette.hexColors.map((c) => p5.color(c)),
                                // secondaryPalette.hexColors.map((c) =>
                                //     p5.color(c)
                                // ),
                                loadedChainTiles,
                                chains
                            );

                            startChain(
                                p5,
                                baseTileStart.x + (tileSize / 16) * 7,
                                baseTileStart.y -
                                    tileSize -
                                    (tileSize / 16) * 4,
                                "left-up",
                                tileSize,
                                mainPalette.hexColors.map((c) => p5.color(c)),
                                // secondaryPalette.hexColors.map((c) =>
                                //     p5.color(c)
                                // ),
                                loadedChainTiles,
                                chains
                            );
                        }
                    } else {
                        if (
                            thisLevel > prevLevel &&
                            prevLevelDifference > 2 &&
                            thisLevel > prevPrevLevel &&
                            prevPrevLevelDifference > 2
                        ) {
                            startChain(
                                p5,
                                baseTileEnd.x - tileSize,
                                baseTileEnd.y + baseTileEnd.ySize * tileSize,
                                "right-down",
                                tileSize,
                                mainPalette.hexColors.map((c) => p5.color(c)),
                                // secondaryPalette.hexColors.map((c) =>
                                //     p5.color(c)
                                // ),
                                loadedChainTiles,
                                chains
                            );

                            startChain(
                                p5,
                                baseTileStart.x + (tileSize / 16) * 7,
                                baseTileStart.y +
                                    baseTileStart.ySize * tileSize,
                                "left-down",
                                tileSize,
                                mainPalette.hexColors.map((c) => p5.color(c)),
                                // secondaryPalette.hexColors.map((c) =>
                                //     p5.color(c)
                                // ),
                                loadedChainTiles,
                                chains
                            );
                        }
                    }
                }
            }

            // graphic grid
            const gridSizeX = Math.ceil(p5.width / (tileSize / 16));
            const gridSizeY = Math.ceil(p5.height / (tileSize / 16));

            for (let i = 0; i < gridSizeX; i++) {
                let colorIndex = 2;
                graphicGrid[i] = [];
                for (let j = 0; j < gridSizeY; j++) {
                    graphicGrid[i][j] = {
                        xIndex: i,
                        yIndex: j,
                        zIndex: 0,
                        xPos: (i * tileSize) / 16,
                        yPos: (j * tileSize) / 16,
                        layer: 0,
                        isUsed: false,
                        color: p5.color(mainPalette.hexColors[colorIndex]),
                    };

                    colorIndex += Math.round(
                        srn(i.toString() + charA + j.toString() + charB + seed)
                    );
                    if (colorIndex >= 4) {
                        colorIndex = 4;
                    }
                    if (colorIndex < 0) {
                        colorIndex = 0;
                    }
                }
            }

            for (let l = 1; l < gridSizeY; l++) {
                let canStart = false;
                let targetX = 0;
                let targetY = 0;
                let seedIndex = 0;
                let checkedTiles = 0;

                while (!canStart) {
                    const x = fcInt(
                        sr(l.toString() + charG + seedIndex) * (gridSizeX / 2) +
                            gridSizeX / 5,
                        gridSizeX / 5,
                        gridSizeX / 2
                    );
                    // const x = gridSizeX / 3;

                    const y = fcInt(
                        sr(l.toString() + charH + seedIndex) * (gridSizeY - 4) +
                            2,
                        2,
                        gridSizeY - 3
                    );
                    // const y = l;

                    if (graphicGrid[x][y] && !graphicGrid[x][y].isUsed) {
                        canStart = true;
                        targetX = x;
                        targetY = y;
                    }

                    seedIndex++;
                    checkedTiles++;
                    if (checkedTiles > gridSizeY) {
                        canStart = true;
                    }
                }

                graphicGrid = addMazeLine({
                    grid: graphicGrid,
                    x: targetX,
                    y: targetY,
                    seed: `lalalax + ${charA} + ${charB} + ${l}`,
                    horizontalTendency: 3,
                });
            }

            //mirror graphic grid horizontally
            for (let i = 0; i < gridSizeX; i++) {
                for (let j = 0; j < gridSizeY; j++) {
                    const thisTile = graphicGrid[i][j];
                    const mirroredTile = graphicGrid[gridSizeX - i - 1][j];

                    mirroredTile.color = thisTile.color;
                    mirroredTile.isUsed = thisTile.isUsed;
                    mirroredTile.layer = thisTile.layer;
                    mirroredTile.zIndex = thisTile.zIndex;
                }
            }

            console.log("added noise setup");

            setupHtml({
                charA: charA,
                charB: charB,
                charC: charC,
                charD: charD,
                charE: charE,
                charF: charF,
                charG: charG,
                charH: charH,

                selectedPalette: selectedPaletteGroup,
            });

            p5.blendMode(p5.BLEND);
        }

        doSetup();

        updateHtml({
            p5: p5,

            charA: charA,
            charB: charB,
            charC: charC,
            charD: charD,
            charE: charE,
            charF: charF,
            charG: charG,
            charH: charH,

            selectedPalette: selectedPaletteGroup,
            doSetup: doSetup,
            newSeed: newSeed,

            seed: seed,

            setupFromSeed: setupFromSeed,
        });
    };

    p5.draw = () => {
        deltaTime++;

        const frameCountUI = document.getElementById("frame-count");
        if (frameCountUI) {
            frameCountUI.innerHTML = p5.frameCount.toString();
        }

        if (!dotsDrawn) {
            p5.blendMode(p5.BLEND);
            for (let i = 0; i < 200; i++) {
                p5.noStroke();
                p5.fill(mainPalette.hexColors[4]);
                p5.rect(
                    p5.random(p5.width),
                    p5.random(p5.height),
                    tileSize / 16,
                    tileSize / 16
                );
            }
            dotsDrawn = true;
        }

        if (!graphicGridDrawn) {
            for (let i = 0; i < graphicGrid.length; i++) {
                for (let j = 0; j < graphicGrid[i].length; j++) {
                    const thisTile = graphicGrid[i][j];

                    if (thisTile.isUsed) {
                        p5.fill(thisTile.color);

                        p5.rect(
                            thisTile.xPos,
                            thisTile.yPos,
                            tileSize / 16,
                            tileSize / 16
                        );
                    }
                }
            }
            graphicGridDrawn = true;
        }

        if (!corbelsDrawn) {
            p5.blendMode(p5.BLEND);
            for (let i = 0; i < corbels.length; i++) {
                // p5.fill("#f44");
                // p5.rect(
                //     corbels[i].x,
                //     corbels[i].y,
                //     tileSize / 16,
                //     tileSize / 16
                // );
                const thisCorbel = corbels[i];
                // console.log(thisCorbel);

                if (thisCorbel.image) {
                    // console.log("drawing corbel");
                    drawImageWithBrushes({
                        p5: p5,
                        x: thisCorbel.x,
                        y: thisCorbel.y,
                        image: thisCorbel.image,
                        brushMode: "rectangle",
                        brushSize: Math.ceil(tileSize / 16),
                        mainColorPalette: thisCorbel.colors,
                        prevColorPalette: thisCorbel.prevColors,
                        nextColorPalette: thisCorbel.nextColors,
                        secondaryPalettesDensity: 0,
                        secondaryColorPalette: thisCorbel.colors,
                        glitchDensity: 0,
                        dontGlitch: true,
                    });
                }
            }
            corbelsDrawn = true;
        }

        if (!groundItemsDrawn) {
            p5.blendMode(p5.BLEND);
            for (let i = 0; i < groundItems.length; i++) {
                const thisItem = groundItems[i];
                // console.log(thisItem);

                if (thisItem.image) {
                    // console.log("drawing item");
                    drawImageWithBrushes({
                        p5: p5,
                        x: thisItem.x,
                        y: thisItem.y,
                        image: thisItem.image,
                        brushMode: "rectangle",
                        brushSize: Math.ceil(tileSize / 16),
                        mainColorPalette: thisItem.colors,
                        prevColorPalette: thisItem.prevColors,
                        nextColorPalette: thisItem.nextColors,
                        secondaryPalettesDensity: 0,
                        secondaryColorPalette: thisItem.colors2,
                        glitchDensity: 0,
                        dontGlitch: true,
                    });
                }
            }
            groundItemsDrawn = true;
        }

        if (!gridDrawn) {
            // for (let i = 0; i < grid.length && i < p5.frameCount; i++) {
            let i = p5.frameCount - 1;
            if (i < grid.length) {
                for (let j = 0; j < grid[i].tiles.length; j++) {
                    const thisTile = grid[i].tiles[j];

                    // console.log("thisTile", thisTile);

                    if (thisTile.image) {
                        drawImageWithBrushes({
                            p5: p5,
                            x: thisTile.x,
                            y: thisTile.y,
                            image: thisTile.image,
                            brushMode: "rectangle",
                            brushSize: Math.ceil(tileSize / 16),
                            mainColorPalette: thisTile.colors,
                            prevColorPalette: thisTile.prevColors,
                            nextColorPalette: thisTile.nextColors,
                            secondaryPalettesDensity:
                                (Math.abs(j + 0.5 - grid[i].tiles.length / 2) /
                                    grid[i].tiles.length) *
                                0.65,
                            secondaryColorPalette: thisTile.colors2,
                            glitchDensity:
                                (Math.abs(j + 0.5 - grid[i].tiles.length / 2) /
                                    grid[i].tiles.length) *
                                2,
                            dontGlitch: thisTile.dontGlitch,

                            accentImage: thisTile.accentImage,
                            accentImageColorPalette: thisTile.colors2,
                        });
                        // }
                    }
                }
            }

            if (p5.frameCount > grid.length + 1) {
                gridDrawn = true;
            }
        }

        if (!chainsDrawn) {
            p5.blendMode(p5.BLEND);
            for (let i = 0; i < chains.length; i++) {
                const thisChain = chains[i];
                console.log(thisChain);

                if (thisChain.image) {
                    // console.log("drawing chain");
                    drawImageWithBrushes({
                        p5: p5,
                        x: thisChain.x,
                        y: thisChain.y,
                        image: thisChain.image,
                        brushMode: "rectangle",
                        brushSize: Math.ceil(tileSize / 16),
                        mainColorPalette: thisChain.colors,
                        prevColorPalette: thisChain.prevColors,
                        nextColorPalette: thisChain.nextColors,
                        secondaryPalettesDensity: 0,
                        secondaryColorPalette: thisChain.colors,
                        glitchDensity: 0,
                        dontGlitch: true,
                        mirroredY: thisChain.mirroredY,
                    });
                }
            }
            chainsDrawn = true;
        }

        if (!humanDrawn) {
            p5.blendMode(p5.BLEND);

            if (human && human.image) {
                drawImageWithBrushes({
                    p5: p5,
                    x: human.x,
                    y: human.y,
                    image: human.image,
                    brushMode: "rectangle",
                    brushSize: Math.ceil(tileSize / 16),
                    mainColorPalette: human.colors,
                    prevColorPalette: human.prevColors,
                    nextColorPalette: human.nextColors,
                    secondaryPalettesDensity: 0,
                    secondaryColorPalette: human.colors2,
                    glitchDensity: 0,
                    dontGlitch: true,

                    accentImage: human.accentImage,
                    accentImageColorPalette: human.colors2,
                    mirroredX: human.mirroredX,
                });

                humanDrawn = true;
            }
        }

        p5.fill(
            p5.color(
                secondaryPalette.hexColors[
                    Math.floor(secondaryPalette.hexColors.length - 2)
                ]
            )
        );
        p5.textFont(font1);
        p5.textSize(tileSize / 2);
        p5.textLeading(tileSize / 1.6);

        p5.blendMode(p5.BLEND);

        p5.text("t\na\nr\nt\na\nr\nu\ns", tileSize / 2, tileSize);

        p5.textSize(tileSize);

        p5.textFont(font2);

        textVertical(
            p5,
            "lalalala mergem la pescuit",
            p5.width - tileSize * 2,
            tileSize
        );

        p5.textFont(font1);

        // p5.noFill();
        // p5.stroke(
        //     secondaryPalette.hexColors[
        //         Math.floor(secondaryPalette.hexColors.length / 2)
        //     ]
        // );
        // p5.strokeWeight(tileSize / 16);
        // p5.rect(
        //     tileSize / 2,
        //     tileSize / 2,
        //     p5.width - tileSize,
        //     p5.height - tileSize
        // );

        //end of draw
        if (p5.frameCount > 3000) {
            //blend mode
            p5.blendMode(p5.OVERLAY);

            //image opacity
            p5.tint(255, 0.12);

            //image
            for (let i = 0; i < p5.width; i += noiseImgMono.width) {
                for (let j = 0; j < p5.height; j += noiseImgMono.height) {
                    p5.image(noiseImgColor, i, j);
                }
            }

            console.log("added noise final");
            const prog = document.getElementById("progress");
            if (prog) {
                prog.innerHTML = "Done!";
            }

            p5.noLoop();
        }
    };
};

new P5(sketch);
