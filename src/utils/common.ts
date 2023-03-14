import seedrandom from "seedrandom";

/**
 * Returns a value between two numbers.
 *
 * @param a - The first number.
 * @param b - The second number.
 *
 * @param percentage - The percentage between the two numbers.
 */

import { ColorObject } from "../types";

export const percentage = (a: number, b: number, percentage: number) => {
    return a + (b - a) * (percentage / 100);
};

/**
 * Returns an mirrored array of a given array.
 *
 * e.g. [1, 2, 3] => [1, 2, 3, 2, 1]
 *
 * @param arr - The array
 */

export const createMirrorArray = (arr: any[]) => {
    return arr.concat(arr.slice(0, -1).reverse());
};

export const createMirrorString = (gradient: string[]) => {
    return gradient.concat(gradient.slice(0, -1).reverse());
};

export const cls = (classes: string[]) => {
    return classes.join(" ");
};

/**
 * Returns a rounded number.
 *
 * @param num - Number to be rounded.
 * @param decimals - Number of decimals.
 */

export const roundDecimals = (num: number, decimals: number): number => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Returns a {r, g, b} object from a hex color.
 *
 * @param hex - Hex color code.
 */

export const hexToRgb = (hex: string) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : {
              r: 0,
              g: 0,
              b: 0,
          };
};

/**
 * Returns a {r, g, b, a} object from a hex color and an alpha value.
 *
 * @param hex - Hex color code.
 * @param alpha - Alpha value.
 */

export const hexToRgba = (hex: string, a: number) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
              a: a,
          }
        : {
              r: 0,
              g: 0,
              b: 0,
              a: 1,
          };
};

/**
 * Returns a rgba string from a hex code and an alpha value.
 *
 * @param hex - Hex color code.
 * @param alpha - Alpha value.
 */

export const hexToRgbaCode = (hex: string, alpha: number) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `rgba(${parseInt(result[1], 16)}, ${parseInt(
              result[2],
              16
          )}, ${parseInt(result[3], 16)}, ${alpha})`
        : `rgba(0, 0, 0, ${alpha % 1})`;
};

/**
 * Returns a hex string from a rgb object.
 *
 * @param rgb - {r, g, b} object.
 */

export const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Returns a hex string from a rgba object.
 *
 * @param rgb - {r, g, b, a} object.
 */

export const rgbaToHex = (r: number, g: number, b: number, a?: number) => {
    const alpha = a ?? 1;
    return (
        "#" +
        ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) +
        Math.round(alpha * 255)
            .toString(16)
            .slice(1)
    );
};

/**
 * Returns a hex string from a rgba string.
 *
 * @param rgba - rgba string.
 */

export const rgbaCodeToHex = (rgba: string) => {
    const result = /^rgba\((\d+), (\d+), (\d+), (\d+)\)$/i.exec(rgba);
    return result
        ? "#" +
              (
                  (1 << 24) +
                  (parseInt(result[1], 10) << 16) +
                  (parseInt(result[2], 10) << 8) +
                  parseInt(result[3], 10)
              )
                  .toString(16)
                  .slice(1)
        : "#000000";
};

export const roundToEven = (num: number) => {
    return Math.round(num / 2) * 2;
};

/**
 * Maps a set of color values to an array of colors.
 *
 * @param colors - array of color values.
 * @param stops - number of stops.
 * @param mode - type of code to return.
 */

export const mapGradient = (
    colors: ColorObject[],
    stops: number,
    mode?: "rgba" | "rgb" | "hex"
): string[] => {
    const rgbColors = colors.map(
        (c) => hexToRgb(c.color) ?? { r: 0, g: 0, b: 0 }
    );

    let stopsArray = [];
    const colorStrips = [];

    if (colors.length === 1) {
        return Array(stops).fill(colors[0]);
    }

    const colorUnit = 1 / (rgbColors.length - 1);
    const stopUnit = 1 / stops;

    for (let i = 0; i < colors.length; i++) {
        colorStrips.push(i * colorUnit);
    }

    for (let i = 0; i < 1; i += stopUnit) {
        if (i !== 0 && i !== stops) {
            for (let j = 0; j < colorStrips.length - 1; j++) {
                if (colorStrips[j] <= i && i < colorStrips[j + 1]) {
                    const colorR = Math.round(
                        rgbColors[j]?.r *
                            ((colorUnit - (i - colorStrips[j])) / colorUnit) +
                            rgbColors[j + 1]?.r *
                                ((colorUnit - (colorStrips[j + 1] - i)) /
                                    colorUnit)
                    );

                    const colorG = Math.round(
                        rgbColors[j]?.g *
                            ((colorUnit - (i - colorStrips[j])) / colorUnit) +
                            rgbColors[j + 1]?.g *
                                ((colorUnit - (colorStrips[j + 1] - i)) /
                                    colorUnit)
                    );

                    const colorB = Math.round(
                        rgbColors[j]?.b *
                            ((colorUnit - (i - colorStrips[j])) / colorUnit) +
                            rgbColors[j + 1]?.b *
                                ((colorUnit - (colorStrips[j + 1] - i)) /
                                    colorUnit)
                    );

                    const alpha = roundDecimals(
                        colors[j].opacity *
                            ((colorUnit - (i - colorStrips[j])) / colorUnit) +
                            colors[j + 1].opacity *
                                ((colorUnit - (colorStrips[j + 1] - i)) /
                                    colorUnit),
                        2
                    );

                    stopsArray.push({
                        r: colorR,
                        g: colorG,
                        b: colorB,
                        alpha: alpha,
                    });
                } else if (i > colorStrips[colorStrips.length - 1]) {
                    stopsArray.push({
                        r: rgbColors[rgbColors.length - 1].r,
                        g: rgbColors[rgbColors.length - 1].g,
                        b: rgbColors[rgbColors.length - 1].b,
                        alpha: colors[colors.length - 1].opacity,
                    });
                }
            }
        } else {
            if (i <= 0) {
                stopsArray.push({
                    r: rgbColors[0].r,
                    g: rgbColors[0].g,
                    b: rgbColors[0].b,
                    alpha: colors[0].opacity,
                });
            } else {
                if (i >= stops) {
                    stopsArray.push({
                        r: rgbColors[rgbColors.length - 1].r,
                        g: rgbColors[rgbColors.length - 1].g,
                        b: rgbColors[rgbColors.length - 1].b,
                        alpha: colors[colors.length - 1].opacity,
                    });
                }
            }
        }
    }

    if (mode === "hex") {
        return stopsArray.map((color) => rgbToHex(color.r, color.g, color.b));
    } else if (mode === "rgb") {
        return stopsArray.map(
            (color) => `rgb(${color.r}, ${color.g}, ${color.b})`
        );
    } else {
        return stopsArray.map(
            (color) =>
                `rgba(${color.r}, ${color.g}, ${color.b}, ${color.alpha})`
        );
    }
};

/**
 * Returns a random number between -1 and 1.
 *
 * @param seed - seed for the random number generator.
 *
 */

export const seedrandomWithNegative = (seed: string | number) => {
    if (typeof seed === "number") {
        seed = seed.toString();
    }
    return seedrandom(seed)() * 2 - 1;
};

/**
 * Returns a random number between -1 and 1 based on a seed.
 *
 * @param seed - seed for the random number generator.
 *
 */

export function srn(seed: string | number, num1?: number, num2?: number) {
    if (num1 !== undefined && num2 !== undefined) {
        return seedrandomWithNegative(seed) * (num2 - num1) + num1;
    }

    if (num1 !== undefined && num2 === undefined) {
        return seedrandomWithNegative(seed) * num1;
    }

    return seedrandomWithNegative(seed);
}

/**
 * Returns a random number between 0 and 1 based on a seed.
 *
 * @param seed - seed for the random number generator.
 *
 */

export function sr(seed: string | number, num1?: number, num2?: number) {
    if (num1 !== undefined && num2 !== undefined) {
        return seedrandom(seed.toString())() * (num2 - num1) + num1;
    }

    if (num1 !== undefined && num2 === undefined) {
        return seedrandom(seed.toString())() * num1;
    }

    return seedrandom(seed.toString())();
}

/**
 * Returns a random number between 0 and 1 based on a seed and an algorithm to generate.
 *
 * @param algorithm number between 0 and 9.
 * @param seed - seed for the random number generator.
 *
 */

export function srExtra(
    algorithm: number,
    seed: string | number,
    num1?: number,
    num2?: number
) {
    let numberToReturn = 0;
    const s = typeof seed === "number" ? seed.toString() : seed;
    let a = algorithm % 1 === 0 ? algorithm : Math.floor(algorithm);

    if (a > 10) {
        a = a % 10;
    }

    if (a < 0) {
        a = Math.abs(a);
    }

    switch (a) {
        default:
            numberToReturn = seedrandom(s)();
            break;
        case 0:
        case 6:
            numberToReturn = seedrandom.xor128(s)();
            break;
        case 1:
        case 7:
            numberToReturn = seedrandom.tychei(s)();
            break;
        case 2:
        case 8:
            numberToReturn = seedrandom.xorwow(s)();
            break;
        case 3:
        case 9:
            numberToReturn = seedrandom.alea(s)();
            break;
        case 4:
            numberToReturn = seedrandom.xorshift7(s)();
            break;
        case 5:
            numberToReturn = seedrandom.xor4096(s)();
            break;
    }

    if (num1 !== undefined && num2 !== undefined) {
        return numberToReturn * (num2 - num1) + num1;
    }

    if (num1 !== undefined && num2 === undefined) {
        return numberToReturn * num1;
    }

    return numberToReturn;
}

/**
 * Returns a random number between -1 and 1 based on a seed and an algorithm to generate.
 *
 * @param algorithm number between 0 and 9.
 * @param seed - seed for the random number generator.
 *
 */

export const srnExtra = (
    algorithm: number,
    seed: string | number,
    num1?: number,
    num2?: number
) => {
    if (num1 !== undefined && num2 !== undefined) {
        return srExtra(algorithm, seed, num1, num2) * 2 - 1;
    }

    if (num1 !== undefined && num2 === undefined) {
        return srExtra(algorithm, seed, num1) * 2 - 1;
    }

    return srExtra(algorithm, seed) * 2 - 1;
};

export const sre = srExtra;

export const floorCeiling = (num: number, floor: number, ceiling: number) => {
    return Math.min(Math.max(num, floor), ceiling);
};

export const clamp = (num: number, min: number, max: number) => {
    return Math.min(Math.max(num, min), max);
};

export const fc = (num: number, floor: number, ceiling: number) => {
    return floorCeiling(num, floor, ceiling);
};

export const fcInt = (num: number, floor: number, ceiling: number) => {
    return Math.floor(Math.min(Math.max(num, floor), ceiling));
};

/**
 * Returns a {rgba} object from a rgba string.
 *
 * @param rgba - rgba string.
 *
 */

export const rgbaToObject = (rgba: string) => {
    const result = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+|\d*\.\d+)\)$/.exec(
        rgba
    );
    return result
        ? {
              r: parseInt(result[1], 10),
              g: parseInt(result[2], 10),
              b: parseInt(result[3], 10),
              a: parseFloat(result[4]),
          }
        : {
              r: 0,
              g: 0,
              b: 0,
              a: 0,
          };
};

/**
 * Returns the average rgba value of an array of rgba strings.
 *
 * @param rgba - rgba string array.
 * @param options:
 *  @option keepMaxAlpha - if true, the alpha value of the returned color will be the max alpha value of the array.
 *  @option withAlphaValue - calculates the average alpha value of the array.
 *
 */

export const averageRgba = (
    rgba: string[],
    options?: { keepMaxAlpha: boolean; withAlphaValue: boolean }
) => {
    let maxAlpha = 0;

    let { r0, g0, b0, a0 } = { r0: 0, g0: 0, b0: 0, a0: 0 };

    if (!options?.withAlphaValue) {
        rgba.forEach((c) => {
            const { r, g, b, a } = rgbaToObject(c) || {
                r: 0,
                g: 0,
                b: 0,
                a: 0,
            };
            r0 += r;
            g0 += g;
            b0 += b;
            a0 += a;

            if (a > maxAlpha) {
                maxAlpha = a;
            }
        });
    } else {
        rgba.forEach((c) => {
            const { r, g, b, a } = rgbaToObject(c) || {
                r: 0,
                g: 0,
                b: 0,
                a: 0,
            };
            r0 += r * a;
            g0 += g * a;
            b0 += b * a;
            a0 += a;

            if (a > maxAlpha) {
                maxAlpha = a;
            }
        });
    }

    r0 = Math.round(r0 / a0);
    g0 = Math.round(g0 / a0);
    b0 = Math.round(b0 / a0);
    a0 = Math.round(a0 / a0);

    return options?.keepMaxAlpha
        ? `rgba(${r0}, ${g0}, ${b0}, ${maxAlpha})`
        : `rgba(${r0}, ${g0}, ${b0}, ${a0})`;
};

export const blendRgbaAdditive = (rgba1: string, rgba2: string) => {
    const { r: r1, g: g1, b: b1, a: a1 } = rgbaToObject(rgba1);
    const { r: r2, g: g2, b: b2, a: a2 } = rgbaToObject(rgba2);
    return `rgba(${fcInt(r1 + r2 * a2, 0, 255)}, ${fcInt(
        g1 + g2 * a2,
        0,
        255
    )}, ${fcInt(b1 + b2 * a2, 0, 255)}, ${a1})`;
};

export const blendRgbaHigherColor = (rgba1: string, rgba2: string) => {
    const { r: r1, g: g1, b: b1, a: a1 } = rgbaToObject(rgba1);

    const { r: r2, g: g2, b: b2, a: a2 } = rgbaToObject(rgba2);

    return `rgba(${fcInt(Math.max(r1, r2 * a2), 0, 255)}, ${fcInt(
        Math.max(g1, g2 * a2),
        0,
        255
    )}, ${fcInt(Math.max(b1, b2 * a2), 0, 255)}, ${a1})`;
};

export const blendRgbaReplaceColor = (rgba1: string, rgba2: string) => {
    const { r: r1, g: g1, b: b1, a: a1 } = rgbaToObject(rgba1);
    const { r: r2, g: g2, b: b2, a: a2 } = rgbaToObject(rgba2);

    const r = r1 * (1 - a2) + r2 * a2;
    const g = g1 * (1 - a2) + g2 * a2;
    const b = b1 * (1 - a2) + b2 * a2;

    return `rgba(${fcInt(r, 0, 255)}, ${fcInt(g, 0, 255)}, ${fcInt(
        b,
        0,
        255
    )}, ${a1})`;
};

/**
 * Returns a nested array of rgba strings based on a string array of colors and a color to blend
 *
 * @param gradient - string array of colors.
 * @param newColor - color to blend.
 * @param stops - number of stops.
 * @param blendFunction - blend function to use. (default: "replace")
 *
 */

export const mapSecondaryGradient = (
    gradient: string[],
    newColor: string,
    stops: number,
    blendFunction?: "additive" | "replace" | "higherColor"
) => {
    const newGradient: string[][] = [];

    const gradientRgba = gradient.map((c) => hexToRgbaCode(c, 1));
    const alphaUnit = 1 / stops;

    for (let i = 0; i < gradientRgba.length; i++) {
        newGradient.push([]);

        for (let j = stops - 1; j >= 0; j--) {
            const newColorRgba = hexToRgbaCode(newColor, j * alphaUnit);

            switch (blendFunction) {
                case "additive":
                    newGradient[i].push(
                        blendRgbaAdditive(gradientRgba[i], newColorRgba)
                    );
                    break;

                case "higherColor":
                    newGradient[i].push(
                        blendRgbaHigherColor(gradientRgba[i], newColorRgba)
                    );
                    break;
                case "replace":
                default:
                    newGradient[i].push(
                        blendRgbaReplaceColor(gradientRgba[i], newColorRgba)
                    );
                    break;
            }
        }
    }

    return newGradient;
};

export const makeBooleanArray2D = (x: number, y: number, value?: boolean) => {
    const newArray: boolean[][] = [];

    for (let i = 0; i < x; i++) {
        newArray.push([]);
        for (let j = 0; j < y; j++) {
            newArray[i].push(value ? value : false);
        }
    }
    return newArray;
};

export const makeBooleanArray3D = (
    x: number,
    y: number,
    z: number,
    value?: boolean
) => {
    const newArray: boolean[][][] = [];

    for (let i = 0; i < z; i++) {
        newArray.push([]);
        for (let j = 0; j < y; j++) {
            newArray[i].push([]);
            for (let k = 0; k < x; k++) {
                newArray[i][j].push(value ? value : false);
            }
        }
    }
    return newArray;
};

export const makeCircleBooleanArray2D = (
    gridSizeX: number,
    gridSizeY: number,
    radius: number,
    value: boolean,
    center?: { x: number; y: number },
    randomness?: number,
    randomSeed?: number
) => {
    const newArray: boolean[][] = [];

    const centerX = center?.x || gridSizeX / 2;
    const centerY = center?.y || gridSizeY / 2;

    const random = randomness || 0;
    const rseed = randomSeed || 0;

    for (let i = 0; i < gridSizeX; i++) {
        newArray.push([]);
        for (let j = 0; j < gridSizeY; j++) {
            const xpow = Math.pow(i - centerX, 2);
            const ypow = Math.pow(j - centerY, 2);
            const distance = Math.sqrt(xpow + ypow);

            const rand =
                randomness && randomSeed
                    ? rseed % 3 === 2
                        ? seedrandomWithNegative(
                              i.toString() + rseed + j.toString()
                          ) * random
                        : rseed % 3 === 1
                        ? seedrandomWithNegative(
                              j.toString() + rseed + i.toString()
                          ) * random
                        : seedrandomWithNegative(
                              rseed + i.toString() + j.toString()
                          ) * random
                    : 0;

            newArray[i].push(distance < radius + rand ? value : !value);
        }
    }

    return newArray;
};

export function degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number) {
    return (radians * 180) / Math.PI;
}

export function dtr(degrees: number) {
    return degreesToRadians(degrees);
}

export function rtd(radians: number) {
    return radiansToDegrees(radians);
}

/**
 * Returns a random boolean value based on a seed and a threshold value.
 *
 * @param seed - seed to use.
 * @param threshold - threshold value.
 *
 */

export const randomBoolean = (seed: string, threshold?: number) => {
    const t = threshold || 0.5;
    return seedrandom(seed)() > t;
};

export const rb = randomBoolean;

/**
 * Returns the distance between two points in a 3d grid.
 *
 * @param p1: {x1, y1, z1} - coordinates of the first point.
 * @param p2: {x2, y2, z2} - coordinates of the second point.
 *
 */

export const calculate3DDistance = (
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
) => {
    const distanceX = Math.abs(x1 - x2);
    const distanceY = Math.abs(y1 - y2);
    const distanceZ = Math.abs(z1 - z2);

    const distance = Math.sqrt(
        Math.pow(distanceX, 2) + Math.pow(distanceY, 2) + Math.pow(distanceZ, 2)
    );

    return distance;
};

export const mapSphereTo3DGrid = (
    gridSizeX: number,
    gridSizeY: number,
    gridSizeZ: number,
    radius: number,
    randomness?: number,
    randomnessSeed?: string
) => {
    const newArray: boolean[][][] = [];

    if (randomnessSeed && randomness !== undefined) {
        for (let i = 0; i < gridSizeZ; i++) {
            newArray.push([]);
            for (let j = 0; j < gridSizeY; j++) {
                newArray[i].push([]);
                for (let k = 0; k < gridSizeX; k++) {
                    if (randomness && randomnessSeed) {
                        const rand1 =
                            seedrandomWithNegative(
                                i +
                                    randomnessSeed +
                                    Math.sqrt(j) +
                                    Math.pow(k, 2)
                            ) * randomness;

                        const distance =
                            calculate3DDistance(
                                i,
                                j,
                                k,
                                gridSizeX / 2,
                                gridSizeY / 2,
                                gridSizeZ / 2
                            ) / gridSizeX;
                        const radiusRand = radius + rand1;
                        // console.log("distance: ", distance);
                        // console.log("radius rand: ", radiusRand);
                        const isUsed = distance < radiusRand;

                        newArray[i][j].push(isUsed);
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < gridSizeZ; i++) {
            newArray.push([]);
            for (let j = 0; j < gridSizeY; j++) {
                newArray[i].push([]);
                for (let k = 0; k < gridSizeX; k++) {
                    const distance =
                        calculate3DDistance(
                            i,
                            j,
                            k,
                            gridSizeX / 2,
                            gridSizeY / 2,
                            gridSizeZ / 2
                        ) / gridSizeX;
                    const isUsed = distance < radius;
                    newArray[i][j].push(isUsed);
                }
            }
        }
    }

    return newArray;
};

export const calculatePointFromAngle = (params: {
    originX: number;
    originY: number;
    angle: number;
    distance: number;
    mode: "degrees" | "radians";
}) => {
    const { originX, originY, distance } = params;
    const angle = params.mode === "degrees" ? dtr(params.angle) : params.angle;
    const x = originX + distance * Math.cos(angle);
    const y = originY + distance * Math.sin(angle);
    return { x, y };
};

export const calculateAngleBetweenPoints = (params: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    mode: "degrees" | "radians";
}) => {
    const { x1, y1, x2, y2 } = params;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    return params.mode === "degrees" ? rtd(angle) : angle;
};

export const calculateColorBrightness = (color: string) => {
    const rgb = color.replace(/^rgb\(|\s+|\)$/g, "").split(",");
    const r = parseInt(rgb[0]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2]);
    return Math.round((r * 299 + g * 587 + b * 114) / 1000);
};

export const compareColorBrightness = (color1: string, color2: string) => {
    const color1Brightness = calculateColorBrightness(color1);
    const color2Brightness = calculateColorBrightness(color2);
    return color1Brightness - color2Brightness;
};

export const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return [h, s, v];
};

export const hsvToRgb = (h: number, s: number, v: number) => {
    let r = 0;
    let g = 0;
    let b = 0;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }

    return [r * 255, g * 255, b * 255];
};

export const addSaturation = (hexColor: string, amount: number) => {
    const colorRgb = hexToRgb(hexColor);
    const [h, s, v] = rgbToHsv(colorRgb.r, colorRgb.g, colorRgb.b);
    let newS = s + amount;
    if (newS > 1) {
        newS = 1;
    }
    if (newS < 0) {
        newS = 0;
    }
    const [r, g, b] = hsvToRgb(h, newS, v);
    return rgbToHex(r, g, b);
};

export const addHue = (hexColor: string, amount: number) => {
    const colorRgb = hexToRgb(hexColor);
    const [h, s, v] = rgbToHsv(colorRgb.r, colorRgb.g, colorRgb.b);
    let newH = h + amount;
    if (newH > 1) {
        while (newH > 1) {
            newH -= 1;
        }
    }
    if (newH < 0) {
        while (newH < 0) {
            newH += 1;
        }
    }

    const [r, g, b] = hsvToRgb(newH, s, v);
    return rgbToHex(r, g, b);
};

export const addBrightness = (hexColor: string, amount: number) => {
    const colorRgb = hexToRgb(hexColor);
    const [h, s, v] = rgbToHsv(colorRgb.r, colorRgb.g, colorRgb.b);
    let newV = v + amount;
    if (newV > 1) newV = 1;
    if (newV < 0) newV = 0;

    const [r, g, b] = hsvToRgb(h, s, newV);
    return rgbToHex(r, g, b);
};

/**
 * Adds HSV to a color.
 *
 * @param hexColor  - The color to add HSV to.
 * @param h - hue, between -1 and 1
 * @param s - saturation, between -1 and 1
 * @param v - value, between -1 and 1
 *
 * @returns The new color.
 */

export const addHSV = (hexColor: string, h: number, s: number, v: number) => {
    const colorRgb = hexToRgb(hexColor);
    const [hsvH, hsvS, hsvV] = rgbToHsv(colorRgb.r, colorRgb.g, colorRgb.b);
    let newH = hsvH + h;
    let newS = hsvS + s;
    let newV = hsvV + v;

    if (newH > 1) {
        while (newH > 1) {
            newH -= 1;
        }
    }
    if (newH < 0) {
        while (newH < 0) {
            newH += 1;
        }
    }

    if (newS > 1) newS = 1;
    if (newS < 0) newS = 0;

    if (newV > 1) newV = 1;
    if (newV < 0) newV = 0;

    const [r, g, b] = hsvToRgb(newH, newS, newV);
    return rgbToHex(Math.floor(r), Math.floor(g), Math.floor(b));
};

export const rgbaCodeToRgb = (rgbaCode: string) => {
    const rgba = rgbaCode.replace("rgba(", "").replace(")", "").split(",");
    return {
        r: parseInt(rgba[0], 10),
        g: parseInt(rgba[1], 10),
        b: parseInt(rgba[2], 10),
    };
};

export const addHSVToRGBACode = (
    rgbaCode: string,
    h: number,
    s: number,
    br: number
) => {
    const colorRgb = rgbaCodeToRgb(rgbaCode);
    const [hsvH, hsvS, hsvV] = rgbToHsv(colorRgb.r, colorRgb.g, colorRgb.b);
    let newH = roundDecimals(hsvH + h, 3);
    let newS = roundDecimals(hsvS + s, 3);
    let newV = roundDecimals(hsvV + br, 3);

    if (newH > 1) {
        while (newH > 1) {
            newH -= 1;
        }
    }
    if (newH < 0) {
        while (newH < 0) {
            newH += 1;
        }
    }

    if (newS > 1) newS = 1;
    if (newS < 0) newS = 0;

    if (newV > 1) newV = 1;
    if (newV < 0) newV = 0;

    const [r, g, b] = hsvToRgb(newH, newS, newV);
    return rgbToHex(Math.floor(r), Math.floor(g), Math.floor(b));
};

export const seedShuffle = (arrayToShuffle: any[], seed: number | string) => {
    const shuffledArray = [...arrayToShuffle];
    let m = shuffledArray.length;
    let t;
    let i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = (sr(seed) * m--) >>> 0;

        // And swap it with the current element.
        t = shuffledArray[m];
        shuffledArray[m] = shuffledArray[i];
        shuffledArray[i] = t;
    }

    return shuffledArray;
};

export const roundToDivisible = (number: number, divisor: number) => {
    return Math.round(number / divisor) * divisor;
};

export const seedrandomInt = (seed: number | string, max: number) => {
    return Math.floor(sr(seed) * max);
};

export const srInt = seedrandomInt;
