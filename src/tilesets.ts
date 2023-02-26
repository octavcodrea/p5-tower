import { TileSet } from "./types";

import TestLeft from "./assets/tilesets/test/test-left.png";
import TestMiddle from "./assets/tilesets/test/test-middle.png";
import TestRight from "./assets/tilesets/test/test-right.png";

export const tilesets: TileSet[] = [
    {
        name: "tileset-test",
        ySize: 1,
        leftEdge: {
            imageSrc: TestLeft,
            xSize: 1,
            ySize: 1,
            type: "left-edge",
        },
        middle: [
            {
                imageSrc: TestMiddle,
                xSize: 1,
                ySize: 1,
                type: "middle",
            },
        ],
        rightEdge: {
            imageSrc: TestRight,
            xSize: 1,
            ySize: 1,
            type: "right-edge",
        },
    },
];
