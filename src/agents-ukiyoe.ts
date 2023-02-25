import P5 from "p5";
import { u } from "./app";
import { store } from "./store";
import {
    angleFromVector,
    angleToVector,
    brushstrokeLine,
    brushstrokePencil,
    randomFromArray,
    vectorFieldDirectional,
    vector_field,
} from "./utils/p5utils";

export class drawingAgent {
    p5: P5;
    agentIndex: number;
    baseVector: P5.Vector;
    colors: P5.Color[];
    strokeWidth: number;
    vector: P5.Vector;

    x: number;
    y: number;

    deltaTime: number;
    devMode: boolean = true;

    zIndex: number = 0;
    hasFinished: boolean = false;
    seed: string;

    size: number = u(5);

    constructor(params: {
        p5: P5;
        agentIndex: number;

        x: number;
        y: number;

        baseVector: P5.Vector;
        colors: P5.Color[];
        strokeWidth: number;
        deltaTime: number;

        zIndex: number;
        seed: string;
        size: number;
    }) {
        const {
            p5,
            agentIndex,
            x,
            y,
            baseVector,
            colors,
            strokeWidth,
            deltaTime,
            zIndex,
            seed,
            size,
        } = params;

        this.p5 = p5;
        this.agentIndex = agentIndex;

        this.x = x;
        this.y = y;

        this.baseVector = baseVector;
        this.colors = colors;
        this.strokeWidth = strokeWidth;

        this.deltaTime = deltaTime;
        this.devMode = store.getState().devMode;

        this.zIndex = zIndex;

        this.seed = seed;
        this.size = size;

        this.vector = vectorFieldDirectional({
            p5: this.p5,
            x: this.x,
            y: this.y,
            baseVector: this.baseVector,
            frameCount: p5.frameCount - this.deltaTime,
            noiseIntensity: 0,
            seed: seed,
        });
    }

    update() {}
}

export class treetrunkAgent extends drawingAgent {
    addAgent: (agent: drawingAgent) => void;
    lightPoint: { x: number; y: number };

    constructor(params: {
        p5: P5;
        agentIndex: number;

        x: number;
        y: number;

        baseVector: P5.Vector;
        colors: P5.Color[];
        strokeWidth: number;
        deltaTime: number;

        seed: string;
        zIndex: number;
        size: number;

        lightPoint: { x: number; y: number };

        addAgent: (agent: drawingAgent) => void;
    }) {
        super(params);
        this.addAgent = params.addAgent;
        this.lightPoint = params.lightPoint;
    }

    update() {
        if (this.hasFinished) return;

        const { p5 } = this;
        const localframeCount = p5.frameCount - this.deltaTime;
        const seedfc = this.seed + (p5.frameCount - this.deltaTime);

        // brushstrokePencil({
        //     p5: this.p5,
        //     x: this.x,
        //     y: this.y,
        //     brushSize: this.size,
        //     color: this.colors[0],
        //     density: 0.8,
        //     stippleSize: this.size / 10,
        //     stipplePositionRandomness: u(2),
        //     stippleSizeRandomness: u(1),
        //     frameCount: this.p5.frameCount - this.deltaTime,
        // });

        brushstrokeLine({
            p5: p5,
            x: this.x,
            y: this.y,
            brushProps: {
                // brushStrokeWidth: this.strokeWidth,
                brushStrokeWidth: this.size,
                stipplePositionRandomness: u(2),
                // density: 1,
                // stippleScale: u(1),
            },
            brushType: "lightShadow",
            lightPoint: this.lightPoint,
            colors: this.colors,

            hueRandomness: 0.04,
            valueRandomness: 0.04,
            stippleSizeRandomness: 0.5,

            frameCount: p5.frameCount - this.deltaTime,
            directionAngle: angleFromVector(this.vector),
            drip: 0,
            devMode: this.devMode,
        });

        if (localframeCount % 100 === 0) {
            this.vector = vectorFieldDirectional({
                p5: this.p5,
                x: this.x,
                y: this.y,
                baseVector: this.baseVector,
                frameCount: p5.frameCount - this.deltaTime,
                noiseIntensity: 0.2,
                seed: seedfc,
            });

            if (localframeCount % 50 === 0) {
                const thisAngle = this.vector.heading();
                //90 deg to radians = 1.5708
                const newAngle =
                    thisAngle + randomFromArray([-1.2, 1.2, -0.75, 0.75]);
                const newVector = angleToVector(p5, newAngle);

                const newAgent = new treebranchAgent({
                    p5: this.p5,
                    agentIndex: this.agentIndex,
                    x: this.x,
                    y: this.y,
                    baseVector: newVector,
                    colors: this.colors,
                    strokeWidth: this.strokeWidth,
                    deltaTime: p5.frameCount,
                    zIndex: this.zIndex + Math.floor(p5.random(-3, 3)),
                    seed: seedfc,
                    size: this.size * 0.5,
                    addAgent: this.addAgent,
                    lightPoint: this.lightPoint,
                });

                this.addAgent(newAgent);
            }
        }

        this.size = this.size * 0.998;

        this.x += this.vector.x;
        this.y += this.vector.y;
    }
}

export class treebranchAgent extends drawingAgent {
    addAgent: (agent: drawingAgent) => void;
    onCooldown: boolean = true;
    lightPoint: { x: number; y: number };

    constructor(params: {
        p5: P5;
        agentIndex: number;

        x: number;
        y: number;

        baseVector: P5.Vector;
        colors: P5.Color[];
        strokeWidth: number;
        deltaTime: number;

        seed: string;
        zIndex: number;

        size: number;
        addAgent: (agent: drawingAgent) => void;
        lightPoint: { x: number; y: number };
    }) {
        super(params);
        this.addAgent = params.addAgent;
        this.lightPoint = params.lightPoint;
    }

    update() {
        if (this.hasFinished) return;

        const { p5 } = this;
        const localframeCount = p5.frameCount - this.deltaTime;
        const seedfc = this.seed + (p5.frameCount - this.deltaTime);

        p5.blendMode(p5.BLEND);

        p5.strokeWeight(this.strokeWidth);

        brushstrokeLine({
            p5: p5,
            x: this.x,
            y: this.y,
            brushProps: {
                // brushStrokeWidth: this.strokeWidth,
                brushStrokeWidth: this.size,
                stipplePositionRandomness: u(1),
                // density: 1,
                // stippleScale: u(1),
            },
            brushType: "lightShadow",
            lightPoint: this.lightPoint,
            colors: this.colors,

            hueRandomness: 0,
            valueRandomness: 0,
            stippleSizeRandomness: 0.5,

            frameCount: p5.frameCount - this.deltaTime,
            directionAngle: angleFromVector(this.vector),
            drip: 0,

            devMode: this.devMode,
        });

        // brushstrokePencil({
        //     p5: this.p5,
        //     x: this.x,
        //     y: this.y,
        //     brushSize: this.size,
        //     color: this.colors[0],
        //     density: 0.8,
        //     stippleSize: this.size / 10,
        //     stipplePositionRandomness: u(2),
        //     stippleSizeRandomness: u(1),
        //     frameCount: this.p5.frameCount - this.deltaTime,
        // });

        if (localframeCount % 50 === 0) {
            if (this.onCooldown && localframeCount > 50) {
                this.onCooldown = false;
            }

            this.vector = vectorFieldDirectional({
                p5: this.p5,
                x: this.x,
                y: this.y,
                baseVector: this.baseVector,
                frameCount: p5.frameCount - this.deltaTime,
                noiseIntensity: 0.2,
                seed: seedfc,
            });

            if (!this.onCooldown) {
                const thisAngle = this.vector.heading();
                //90 deg to radians = 1.5708
                const newAngle =
                    thisAngle + randomFromArray([-1.2, 1.2, -0.75, 0.75]);
                const newVector = angleToVector(p5, newAngle);

                const newAgent = new treebranchAgent({
                    p5: this.p5,
                    agentIndex: this.agentIndex,
                    x: this.x,
                    y: this.y,
                    baseVector: newVector,
                    colors: this.colors,
                    strokeWidth: this.strokeWidth,
                    deltaTime: p5.frameCount,
                    zIndex: this.zIndex,
                    seed: seedfc,
                    size: this.size * 0.5,
                    addAgent: this.addAgent,
                    lightPoint: this.lightPoint,
                });

                this.addAgent(newAgent);
            }
        }

        this.size = this.size * 0.992;

        if (this.size < u(1)) {
            this.hasFinished = true;
        }

        this.x += this.vector.x;
        this.y += this.vector.y;
    }
}
