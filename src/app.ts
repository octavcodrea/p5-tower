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
import { tilesets } from "./tilesets";
import { Grid, TileSet } from "./types";
import { addGridLayer, createGridLayer } from "./tower-utils";

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

            for (let i = 0; i < 26; i++) {
                const thisTileset = loadedTilesets[i % loadedTilesets.length];

                const thisLayer = createGridLayer(
                    p5,
                    seed + i,
                    thisTileset,
                    []
                );

                addGridLayer(grid, thisLayer, tileSize, p5.width, p5.height);
            }

            // // noise setup
            // //blend mode
            // p5.blendMode(p5.OVERLAY);

            // //image opacity
            // p5.tint(255, 0.2);

            // //image
            // for (let i = 0; i < p5.width; i += noiseImgMono.width) {
            //     for (let j = 0; j < p5.height; j += noiseImgMono.height) {
            //         p5.image(noiseImgMono, i, j);
            //     }
            // }

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

        if (!tilesDrawn) {
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[i].tiles.length; j++) {
                    const thisTile = grid[i].tiles[j];

                    console.log("thisTile", thisTile);

                    if (thisTile.image) {
                        drawImageWithBrushes(
                            p5,
                            thisTile.x,
                            thisTile.y,
                            thisTile.image,
                            "rectangle",
                            Math.ceil(tileSize / 16),
                            // 4,
                            Palettes[selectedPalette].hexColors.map((c) =>
                                p5.color(c)
                            )
                        );
                    }
                }
            }
            tilesDrawn = true;
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
