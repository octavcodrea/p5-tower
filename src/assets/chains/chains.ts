import { Tile } from "../../types";

import LeftBase from "./left-base.png";
import Left from "./left.png";
import RightBase from "./right-base.png";
import Right from "./right.png";

export const chainTiles: Tile[] = [
    { id: "left-base", imageSrc: LeftBase, xSize: 1, ySize: 1, type: "chain" },
    { id: "left", imageSrc: Left, xSize: 1, ySize: 1, type: "chain" },
    {
        id: "right-base",
        imageSrc: RightBase,
        xSize: 1,
        ySize: 1,
        type: "chain",
    },
    { id: "right", imageSrc: Right, xSize: 1, ySize: 1, type: "chain" },
];
