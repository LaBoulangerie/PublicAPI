const fs = require("fs");
const { Canvas, loadImage } = require("skia-canvas");
const colors = require("./colors.json");
const patterns = require("./patterns.json");
const { Color, Solver } = require("./filterGen");

const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 400;

const BANNER_WIDTH = 20;
const BANNER_HEIGHT = 40;

const PATTERN_IMG_COL = 5;

let CANVAS;
let CTX;

let colorCopy;

const imageToCanvas = async (image, sourceX, sourceY) => {
    const COLOR_CANVAS = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const COLOR_CTX = COLOR_CANVAS.getContext("2d");
    COLOR_CTX.imageSmoothingEnabled = false;

    COLOR_CTX.drawImage(
        image,
        sourceX,
        sourceY,
        BANNER_WIDTH,
        BANNER_HEIGHT,
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
    );

    return COLOR_CANVAS;
};

const drawPattern = async (patternImagePath, patternString, colorString) => {
    let patternImage = await loadImage(__dirname + patternImagePath);
    let patternIndex = patterns.indexOf(patternString);

    let sourceX = (patternIndex % PATTERN_IMG_COL) * BANNER_WIDTH;
    let sourceY = Math.floor(patternIndex / PATTERN_IMG_COL) * BANNER_HEIGHT;

    const rgb = colors[colorString];

    const color = new Color(rgb[0], rgb[1], rgb[2]);
    const solver = new Solver(color);
    const result = solver.solve();

    colorCopy = await imageToCanvas(patternImage, sourceX, sourceY);

    CTX.filter = result.filter;
    CTX.drawImage(colorCopy, 0, 0);
};

const buildBanner = async (baseColor, patterns) => {
    CANVAS = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    CTX = CANVAS.getContext("2d");

    // For a pixelated image
    CTX.imageSmoothingEnabled = false;

    CTX.fillStyle = `rgb(${colors[baseColor.toLowerCase()].join(",")})`;
    CTX.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (const patternObj of patterns) {
        await drawPattern(
            "/patterns.png",
            patternObj.pattern,
            patternObj.color.toLowerCase()
        );
    }

    // // Base color

    return CANVAS.toBuffer();
};

module.exports = { buildBanner };
