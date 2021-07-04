const townController = require("../controller/towns");

const routes = [
    {
        method: "GET",
        url: "/towns",
        handler: townController.getAllTowns,
    },
    {
        method: "GET",
        url: "/town",
        handler: townController.getTown,
    },
];

module.exports = routes;
