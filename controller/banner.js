const canvas = require("canvas");
const { buildBanner } = require("../utils/banner/bannerBuilder");
const msg = require("../utils/msg");
const colorsArray = require("../utils/banner/colors.json");
const patternsArray = require("../utils/banner/patterns.json");

const isGoodRequest = (baseColor, patterns) => {
    let goodRequest = true;

    if (!baseColor || !patterns) return (goodRequest = false);

    baseColor = baseColor.toLowerCase();
    patterns = JSON.parse(patterns);
    if (!colorsArray[baseColor] || !patterns.length)
        return (goodRequest = false);

    patterns.forEach((patternObj) => {
        if (!patternObj.pattern || !patternObj.color)
            return (goodRequest = false);

        patternObj.pattern = patternObj.pattern.toLowerCase();
        patternObj.color = patternObj.color.toLowerCase();

        if (
            !patternsArray.includes(patternObj.pattern) ||
            !colorsArray[patternObj.color]
        )
            return (goodRequest = false);
    });

    return goodRequest;
};

const getBanner = async (req, res) => {
    let baseColor = req.query.baseColor;
    let patterns = req.query.patterns;

    let testRequest = isGoodRequest(baseColor, patterns);
    if (!testRequest) {
        return msg.error("Check the docs", "Bad Request", 400);
    }

    baseColor = baseColor.toLowerCase();
    patterns = JSON.parse(patterns);

    res.header("Content-Type", "image/png");

    // baseColor = BLUE

    // patterns = [
    //     {
    //         color: "BLACK",
    //         pattern: "bs",
    //     },
    //     {
    //         color: "YELLOW",
    //         pattern: "cs",
    //     },
    // ];

    // Verification

    res.send(await buildBanner(baseColor, patterns));
};

module.exports = { getBanner };
