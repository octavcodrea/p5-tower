export const intensityWords = [
    "Very low",
    "Low",
    "Medium",
    "High",
    "Very high",
];
export const numberWords = ["Very few", "Few", "Medium", "Many", "Very many"];
import Palettes from "./assets/palettes";
import { map } from "./utils/p5utils";

import { store } from "./store";
import p5 from "p5";

const { devMode } = store.getState();

export function toggleDevMode() {
    store.setState({ devMode: !store.getState().devMode });

    const devmodeCheck = document.getElementById("devmode-check");
    if (devmodeCheck && devmodeCheck instanceof HTMLInputElement) {
        devmodeCheck.checked = store.getState().devMode;
    }
}

export const setupHtml = (params: {
    charA: number;
    charB: number;
    charC: number;
    charD: number;
    charE: number;
    charF: number;
    charG: number;
    charH: number;
    selectedPalette: number;
}) => {
    const {
        charA,
        charB,
        charC,
        charD,
        charE,
        charF,
        charG,
        charH,
        selectedPalette,
    } = params;

    const prog = document.getElementById("progress");
    if (prog) {
        prog.innerHTML = "In progress...";
    }

    const scale = 1;

    const htmlcolor = document.getElementById("info-color");
    if (htmlcolor) {
        const paletteName = Palettes[selectedPalette].name || "Unknown";
        htmlcolor.innerHTML = paletteName;
    }

    const htmlstyle = document.getElementById("info-style");
    if (htmlstyle) {
        const styleName = charC % 3 === 0 ? "Sharp" : "Smooth";
        htmlstyle.innerHTML = styleName;
    }

    const htmlsizevariance = document.getElementById("info-size");
    if (htmlsizevariance) {
        const sizeName =
            intensityWords[
                Math.floor(map(charE, 0, 100, 0, intensityWords.length, "exp"))
            ];
        htmlsizevariance.innerHTML = sizeName;
    }

    // const htmldirection = document.getElementById("info-direction");
    // if (htmldirection) {
    //     const directionName = linesDirection;
    //     htmldirection.innerHTML = directionName;
    // }

    const htmllines = document.getElementById("info-lines");
    if (htmllines) {
        const linesName =
            numberWords[
                Math.floor(map(charB, 0, 100, 0, numberWords.length, "linear"))
            ];
        htmllines.innerHTML = linesName;
    }

    const htmlrandomness = document.getElementById("info-randomness");
    if (htmlrandomness) {
        const randomnessName =
            intensityWords[
                Math.floor(
                    map(charA, 0, 100, 0, intensityWords.length, "linear")
                )
            ];
        htmlrandomness.innerHTML = randomnessName;
    }

    const htmlspread = document.getElementById("info-spread");
    if (htmlspread) {
        const spreadName =
            intensityWords[
                Math.floor(map(charC, 0, 100, 0, intensityWords.length, "exp"))
            ];
        htmlspread.innerHTML = spreadName;
    }
};

export const updateHtml = (params: {
    p5: p5;

    charA: number;
    charB: number;
    charC: number;
    charD: number;
    charE: number;
    charF: number;
    charG: number;
    charH: number;
    selectedPalette: number;

    seed: string;
    newSeed: string;

    setupFromSeed: () => void;
    doSetup: () => void;
}) => {
    const {
        p5,

        charA,
        charB,
        charC,
        charD,
        charE,
        charF,
        charG,
        charH,
        selectedPalette,

        seed,
        newSeed,

        setupFromSeed,
        doSetup,
    } = params;

    const setNewSeed = (newSeed: string) => {
        store.setState({ newSeed });
    };

    const setSeed = (seed: string) => {
        store.setState({ seed });
    };

    const htmlnewseed = document.getElementById("new-seed");
    if (htmlnewseed) {
        if (!document.getElementById("new-seed-button")) {
            const newSeedButton = document.createElement("button");
            newSeedButton.id = "new-seed-button";
            newSeedButton.innerHTML = "Set seed";
            newSeedButton.addEventListener("click", () => {
                const seedInput = document.getElementById("new-seed-input");
                if (seedInput && seedInput instanceof HTMLInputElement) {
                    setNewSeed(seedInput.value);
                    setSeed(seedInput.value);
                    setupFromSeed();
                    doSetup();
                }
            });

            htmlnewseed.appendChild(newSeedButton);
        }

        if (!document.getElementById("reset-button")) {
            //create button to reset
            const resetButton = document.createElement("button");
            resetButton.id = "reset-button";
            resetButton.innerHTML = "Reset";
            resetButton.onclick = () => {
                setupFromSeed();
                doSetup();
            };

            htmlnewseed.appendChild(resetButton);
        }

        if (!document.getElementById("generate-button")) {
            //create generated button
            const generateButton = document.createElement("button");
            generateButton.id = "generate-button";
            generateButton.innerHTML = "Generate";
            generateButton.onclick = () => {
                let generatedSeed = Math.floor(
                    Math.random() * 1000000000000000
                ).toString();

                setSeed(generatedSeed);
                setNewSeed(generatedSeed);

                setupFromSeed();
                doSetup();

                const seedInput = document.getElementById("new-seed-input");
                if (seedInput && seedInput instanceof HTMLInputElement) {
                    seedInput.value = generatedSeed;
                }
            };

            htmlnewseed.appendChild(generateButton);
        }

        //download button
        if (!document.getElementById("download-button")) {
            const downloadButton = document.createElement("button");
            downloadButton.id = "download-button";
            downloadButton.innerHTML = "Download";
            downloadButton.onclick = () => {
                const seed = store.getState().seed;

                //date for title
                p5.saveCanvas(
                    `${seed.toString()}-${new Date().toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }
                    )}`,
                    "png"
                );
            };

            htmlnewseed.appendChild(downloadButton);
        }

        if (!document.getElementById("dev-mode")) {
            const devmodeCheck = document.createElement("input");
            devmodeCheck.type = "checkbox";
            devmodeCheck.id = "dev-mode-check";
            devmodeCheck.checked = devMode;
            devmodeCheck.addEventListener("change", toggleDevMode);

            const devmodeSpan = document.createElement("span");
            devmodeSpan.className = "checkmark";

            const devmodeLabel = document.createElement("label");
            devmodeLabel.className = "dev-mode-label";
            devmodeLabel.htmlFor = "dev-mode-check";
            devmodeLabel.innerHTML = "Dev Mode";

            const container = document.createElement("div");
            container.className = "my-20";

            htmlnewseed.appendChild(container);
            container.appendChild(devmodeLabel);
            devmodeLabel.appendChild(devmodeCheck);
            devmodeLabel.appendChild(devmodeSpan);
        }

        if (!document.getElementById("canvas-width-input")) {
            const canvasWidthInput = document.createElement("input");
            canvasWidthInput.id = "canvas-width-input";
            canvasWidthInput.type = "number";
            canvasWidthInput.value = p5.width.toString();

            const widthValue = parseInt(canvasWidthInput.value);
            const heightValue = widthValue * 1.2;
            canvasWidthInput.addEventListener("change", () => {
                p5.resizeCanvas(widthValue, heightValue);
                store.setState({
                    canvasWidth: widthValue,
                    canvasHeight: heightValue,
                });
                setupFromSeed();
                doSetup();
            });

            htmlnewseed.appendChild(canvasWidthInput);
        }

        if (!document.getElementById("canvas-height-input")) {
            const canvasHeightInput = document.createElement("input");
            canvasHeightInput.id = "canvas-height-input";
            canvasHeightInput.type = "number";
            canvasHeightInput.value = p5.height.toString();
            canvasHeightInput.disabled = true;

            htmlnewseed.appendChild(canvasHeightInput);
        }
    }
};
