const nationController = require("../controller/nations");

const routes = [
    {
        method: "GET",
        url: "/nations",
        handler: nationController.getAllNations,
    },
    {
        method: "GET",
        url: "/nation",
        handler: nationController.getNation,
    },
];

module.exports = routes;
