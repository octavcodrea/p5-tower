import P5 from "p5";
import noiseColor from "./assets/images/noise-color.png";
import noiseMono from "./assets/images/noise-mono.png";

import noiseColorSmall from "./assets/images/noise-color-small.png";
import noiseMonoSmall from "./assets/images/noise-mono-small.png";
import test1png from "./assets/images/test1.png";

import Palettes from "./assets/palettes";
import { store } from "./store";
import { setupHtml, updateHtml } from "./utils";
import { drawingAgent, treetrunkAgent } from "./agents-ukiyoe";
import { drawImageWithBrushes } from "./utils/p5utils";
import { tilesets } from "./assets/tilesets/tilesets";
import { GraphicGrid2D, Grid, TileSet } from "./types";
import {
    addGridLayer,
    addMazeLine,
    createGridLayer,
    getTileColors,
} from "./tower-utils";

// @ts-ignore
import font1Source from "url:./assets/fonts/font1.ttf";
import { fcInt, sr, sre, srn } from "./utils/common";

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
let tilesDrawn = false;
let graphicGridDrawn = false;

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

    let selectedPalette = Math.floor(Palettes.length * (charD / 100));
    let font1: any = undefined;

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

        selectedPalette = Math.floor(Palettes.length * (charD / 100));

        store.setState({ selectedPalette: selectedPalette });

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

        loadedTilesets = tilesets.map((tileset) => {
            const { leftEdge, rightEdge, middle, ...rest } = tileset;
            const loadedLeftEdge = {
                ...leftEdge,
                image: p5.loadImage(leftEdge.imageSrc),
            };
            const loadedMiddle = middle.map((m) => {
                return {
                    ...m,
                    image: p5.loadImage(m.imageSrc),
                };
            });
            const loadedRightEdge = {
                ...rightEdge,
                image: p5.loadImage(rightEdge.imageSrc),
            };

            return {
                ...rest,
                leftEdge: loadedLeftEdge,
                middle: loadedMiddle,
                rightEdge: loadedRightEdge,
            };
        });

        store.setState({ selectedPalette: selectedPalette });
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

            p5.frameCount = 0;
            p5.loop();

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

            tilesDrawn = false;
            graphicGridDrawn = false;
            let previousLayerWidth = 0;
            let shouldMatchPreviousWidth = false;
            let shouldMatchNextWidth = false;

            for (let i = 0; i < 22; i++) {
                // const thisTileset = loadedTilesets[i % loadedTilesets.length];
                const thisTileset =
                    loadedTilesets[
                        Math.floor(loadedTilesets.length * sre(i, seed + i))
                    ];

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

                addGridLayer(grid, thisLayer, tileSize, p5.width, p5.height);

                shouldMatchNextWidth = thisTileset.matchNextWidth;
                previousLayerWidth = thisLayer.totalTilesWidth;
            }

            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[i].tiles.length; j++) {
                    let thisTile = grid[i].tiles[j];

                    const mainPalette = Palettes[selectedPalette].hexColors.map(
                        (c) => p5.color(c)
                    );

                    thisTile.colors = getTileColors(
                        grid[i].tiles.length,
                        j,
                        mainPalette
                    );

                    thisTile.prevColors = getTileColors(
                        grid[i].tiles.length,
                        j - 1,
                        mainPalette
                    );
                    thisTile.nextColors = getTileColors(
                        grid[i].tiles.length,
                        j + 1,
                        mainPalette
                    );

                    grid[i].tiles[j] = thisTile;
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
                        color: p5.color(
                            Palettes[selectedPalette].hexColors[colorIndex]
                        ),
                    };

                    colorIndex += Math.round(
                        srn(i.toString() + charA + j.toString() + charB + seed)
                    );
                    if (colorIndex >= 2) {
                        colorIndex = 2;
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

                selectedPalette: selectedPalette,
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

            selectedPalette: selectedPalette,
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

        p5.fill("#444");
        p5.textFont(font1);
        p5.textSize(tileSize / 2);
        p5.textLeading(tileSize / 1.6);

        p5.blendMode(p5.BLEND);

        p5.text("t\na\nr\nt\na\nr\nu\ns", tileSize / 2, tileSize);

        if (!tilesDrawn) {
            // for (let i = 0; i < grid.length && i < p5.frameCount; i++) {
            let i = p5.frameCount - 1;
            if (i < grid.length) {
                for (let j = 0; j < grid[i].tiles.length; j++) {
                    const thisTile = grid[i].tiles[j];

                    console.log("thisTile", thisTile);

                    const mainPalette = Palettes[selectedPalette].hexColors.map(
                        (c) => p5.color(c)
                    );

                    const otherPalettes = Palettes.filter(
                        (p, i) => i !== selectedPalette
                    );

                    const secondaryPalette1 = otherPalettes[
                        Math.floor(otherPalettes.length * (charB / 100))
                    ].hexColors.map((c) => p5.color(c));

                    const secondaryPalette2 = otherPalettes[
                        Math.floor(otherPalettes.length * (charC / 100))
                    ].hexColors.map((c) => p5.color(c));

                    const palettesToUse = [mainPalette];

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
                                Math.abs(j + 0.5 - grid[i].tiles.length / 2) /
                                grid[i].tiles.length /
                                2,
                            secondaryColorPalette: secondaryPalette1,
                            glitchDensity:
                                (Math.abs(j + 0.5 - grid[i].tiles.length / 2) /
                                    grid[i].tiles.length) *
                                2,
                            dontGlitch: thisTile.dontGlitch,
                        });
                        // }
                    }
                }
            }

            if (p5.frameCount > grid.length) {
                tilesDrawn = true;
            }
        }

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
