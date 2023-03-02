import { TileSet } from "../../types";

import TestLeft from "./test/test-left.png";
import TestMiddle from "./test/test-middle.png";
import TestRight from "./test/test-right.png";

import MiauLeft from "./miau/left.png";
import MiauMiddle from "./miau/middle.png";
import MiauMiddle2 from "./miau/middle2.png";
import MiauRight from "./miau/right.png";

import EyesLeft from "./eyes/left.png";
import EyesMiddle from "./eyes/middle.png";
import EyesRight from "./eyes/right.png";

import Eyes2Left from "./eyes2/left.png";
import Eyes2Middle from "./eyes2/middle.png";
import Eyes2Right from "./eyes2/right.png";

import SkullLeft from "./skull/left.png";
import SkullMiddle from "./skull/middle.png";
import SkullRight from "./skull/right.png";

import ChainLeft from "./chain/left.png";
import ChainMiddle from "./chain/middle.png";
import ChainRight from "./chain/right.png";

import DoorknobLeft from "./doorknob/left.png";
import DoorknobMiddle from "./doorknob/middle.png";
import DoorknobMiddle2 from "./doorknob/middle2.png";
import DoorknobRight from "./doorknob/right.png";

import PillarsLeft from "./pillars/left.png";
import PillarsMiddle from "./pillars/middle.png";
import PillarsRight from "./pillars/right.png";

import Face1Left from "./face1/left.png";
import Face1Middle from "./face1/middle.png";
import Face1Middle2 from "./face1/middle2.png";
import Face1Right from "./face1/right.png";

import Human1Left from "./human1/left.png";
import Human1Middle from "./human1/middle.png";
import Human1Right from "./human1/right.png";

import Human2Left from "./human2/left.png";
import Human2Middle from "./human2/middle.png";
import Human2Middle2 from "./human2/middle2.png";
import Human2Right from "./human2/right.png";

export const tilesets: TileSet[] = [
    // {
    //     name: "tileset-test",
    //     ySize: 1,
    //     leftEdge: {
    //         imageSrc: TestLeft,
    //         xSize: 1,
    //         ySize: 1,
    //         type: "left-edge",
    //     },
    //     middle: [
    //         {
    //             imageSrc: TestMiddle,
    //             xSize: 1,
    //             ySize: 1,
    //             type: "middle",
    //         },
    //     ],
    //     rightEdge: {
    //         imageSrc: TestRight,
    //         xSize: 1,
    //         ySize: 1,
    //         type: "right-edge",
    //     },
    // },

    {
        name: "miau",
        ySize: 1,
        leftEdge: {
            imageSrc: MiauLeft,
            xSize: 1,
            ySize: 1,
            type: "left-edge",
        },
        middle: [
            {
                imageSrc: MiauMiddle,
                xSize: 1,
                ySize: 1,
                type: "middle",
            },
            {
                imageSrc: MiauMiddle2,
                xSize: 1,
                ySize: 1,
                type: "middle",
            },
        ],
        rightEdge: {
            imageSrc: MiauRight,
            xSize: 1,
            ySize: 1,
            type: "right-edge",
        },
    },

    {
        name: "eyes",
        ySize: 1,
        leftEdge: {
            imageSrc: EyesLeft,
            xSize: 1,
            ySize: 1,
            type: "left-edge",
        },
        middle: [
            {
                imageSrc: EyesMiddle,
                xSize: 1,
                ySize: 1,
                type: "middle",
            },
        ],
        rightEdge: {
            imageSrc: EyesRight,
            xSize: 1,
            ySize: 1,
            type: "right-edge",
        },
    },

    {
        name: "eyes2",
        ySize: 1,
        leftEdge: {
            imageSrc: Eyes2Left,
            xSize: 1,
            ySize: 1,
            type: "left-edge",
        },
        middle: [
            {
                imageSrc: Eyes2Middle,
                xSize: 1,
                ySize: 1,
                type: "middle",
            },
        ],
        rightEdge: {
            imageSrc: Eyes2Right,
            xSize: 1,
            ySize: 1,
            type: "right-edge",
        },
    },

    {
        name: "pillars",
        ySize: 2,
        leftEdge: {
            imageSrc: PillarsLeft,
            xSize: 1,
            ySize: 2,
            type: "left-edge",
        },
        middle: [
            {
                imageSrc: PillarsMiddle,
                xSize: 1,
                ySize: 2,
                type: "middle",
            },
        ],
        rightEdge: {
            imageSrc: PillarsRight,
            xSize: 1,
            ySize: 2,
            type: "right-edge",
        },
    },

    {
        name: "chain",
        ySize: 1,
        leftEdge: {
            imageSrc: ChainLeft,
            xSize: 1,
            ySize: 1,
            type: "left-edge",
        },
        middle: [
            {
                imageSrc: ChainMiddle,
                xSize: 1,
                ySize: 1,
                type: "middle",
            },
        ],
        rightEdge: {
            imageSrc: ChainRight,
            xSize: 1,
            ySize: 1,
            type: "right-edge",
        },
    },

    {
        name: "doorknob",
        ySize: 1,
        leftEdge: {
            imageSrc: DoorknobLeft,
            xSize: 1,
            ySize: 1,
            type: "left-edge",
        },
        middle: [
            {
                imageSrc: DoorknobMiddle,
                xSize: 1,
                ySize: 1,
                type: "middle",
            },
            {
                imageSrc: DoorknobMiddle2,
                xSize: 1,
                ySize: 1,
                type: "middle",
            },
        ],

        rightEdge: {
            imageSrc: DoorknobRight,
            xSize: 1,
            ySize: 1,
            type: "right-edge",
        },
    },

    {
        name: "skull",
        ySize: 1,
        leftEdge: {
            imageSrc: SkullLeft,
            xSize: 1,
            ySize: 1,
            type: "left-edge",
        },
        middle: [
            {
                imageSrc: SkullMiddle,
                xSize: 1,
                ySize: 1,
                type: "middle",
            },
        ],
        rightEdge: {
            imageSrc: SkullRight,
            xSize: 1,
            ySize: 1,
            type: "right-edge",
        },
    },

    {
        name: "human1",
        ySize: 2,
        leftEdge: {
            imageSrc: Human1Left,
            xSize: 1,
            ySize: 2,
            type: "left-edge",
        },
        middle: [
            {
                imageSrc: Human1Middle,
                xSize: 1,
                ySize: 2,
                type: "middle",
            },
        ],
        rightEdge: {
            imageSrc: Human1Right,
            xSize: 1,
            ySize: 2,
            type: "right-edge",
        },
    },

    {
        name: "human2",
        ySize: 2,
        leftEdge: {
            imageSrc: Human2Left,
            xSize: 1,
            ySize: 2,
            type: "left-edge",
        },
        middle: [
            {
                imageSrc: Human2Middle,
                xSize: 1,
                ySize: 2,
                type: "middle",
            },
            {
                imageSrc: Human2Middle2,
                xSize: 1,
                ySize: 2,
                type: "middle",
            },
        ],
        rightEdge: {
            imageSrc: Human2Right,
            xSize: 1,
            ySize: 2,
            type: "right-edge",
        },
    },

    {
        name: "face1",
        ySize: 2,
        leftEdge: {
            imageSrc: Face1Left,
            xSize: 1,
            ySize: 2,
            type: "left-edge",
        },
        middle: [
            {
                imageSrc: Face1Middle,
                xSize: 1,
                ySize: 2,
                type: "middle",
            },
            {
                imageSrc: Face1Middle2,
                xSize: 2,
                ySize: 2,
                type: "middle",
            },
        ],
        rightEdge: {
            imageSrc: Face1Right,
            xSize: 1,
            ySize: 2,
            type: "right-edge",
        },
    },
];
