const bannerController = require("../controller/banner");

const routes = [
    {
        method: "GET",
        url: "/banner",
        handler: bannerController.getBanner,
    },
];

module.exports = routes;
