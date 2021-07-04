const statusController = require("../controller/status");

const routes = [
    {
        method: "GET",
        url: "/status",
        handler: statusController.getStatus,
    },
];

module.exports = routes;
