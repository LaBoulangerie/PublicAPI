const playerController = require("../controller/players");

const routes = [
    {
        method: "GET",
        url: "/players",
        handler: playerController.getAllPlayers,
    },
    {
        method: "GET",
        url: "/player",
        handler: playerController.getPlayer,
    },
];

module.exports = routes;
