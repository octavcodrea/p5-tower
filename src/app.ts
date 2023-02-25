import P5 from "p5";
import noiseColor from "./assets/images/noise-color.png";
import noiseMono from "./assets/images/noise-mono.png";

import noiseColorSmall from "./assets/images/noise-color-small.png";
import noiseMonoSmall from "./assets/images/noise-mono-small.png";

import Palettes from "./assets/palettes";
import { store } from "./store";
import { setupHtml, updateHtml } from "./utils";
import { drawingAgent, treetrunkAgent } from "./agents-ukiyoe";

let { canvasWidth, canvasHeight } = store.getState();

const unit = canvasWidth / 1000;
let deltaTime = 0;

let lightPoint = { x: canvasWidth / 2, y: canvasHeight / 2 };

export function u(x: number) {
    if (typeof x === "number") {
        return x * unit;
    } else {
        console.error("Error. u() only accepts numbers");
        return 0;
    }
}

let agents: drawingAgent[] = [];

const addAgent = (agent: drawingAgent) => {
    agents.push(agent);
};

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

    p5.preload = () => {
        noiseImgColor =
            p5.width < 1500
                ? p5.loadImage(noiseColorSmall)
                : p5.loadImage(noiseColor);
        noiseImgMono =
            p5.width < 1500
                ? p5.loadImage(noiseMonoSmall)
                : p5.loadImage(noiseMono);

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

            p5.background(
                p5.color(Palettes[selectedPalette].background).toString()
            );

            agents = [];

            lightPoint = {
                x: p5.random(p5.width),
                y: p5.random(p5.height),
            };

            //draw an ellipse at the light point
            p5.ellipse(lightPoint.x, lightPoint.y, 10, 10);
            p5.fill(p5.color(255));

            const c1 = p5.color("#2E5077");
            const c2 = p5.color("#4DA1A9");

            for (let y = 0; y < canvasHeight; y++) {
                const n = p5.map(y, 0, canvasHeight, 0, 1);
                let newc = p5.lerpColor(c1, c2, n);
                p5.stroke(newc);
                p5.line(0, y, canvasWidth, y);
            }

            //blend mode
            p5.blendMode(p5.OVERLAY);

            //image opacity
            p5.tint(255, 0.2);

            //image
            for (let i = 0; i < p5.width; i += noiseImgMono.width) {
                for (let j = 0; j < p5.height; j += noiseImgMono.height) {
                    p5.image(noiseImgMono, i, j);
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

            agents.push(
                new treetrunkAgent({
                    p5: p5,
                    x: p5.width / 2,
                    y: p5.height * 0.9,
                    agentIndex: 0,
                    baseVector: p5.createVector(0, -1),
                    colors: Palettes[selectedPalette].colorsA.map((c) =>
                        p5.color(c.color)
                    ),
                    deltaTime: deltaTime,
                    strokeWidth: 1,
                    zIndex: 0,
                    seed: seed,
                    size: u(100),

                    addAgent: addAgent,
                    lightPoint: lightPoint,
                })
            );
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

        agents.sort((a, b) => a.zIndex - b.zIndex);

        for (let i = 0; i < agents.length; i++) {
            agents[i].update();
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
