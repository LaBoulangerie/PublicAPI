const mojang = require('../controller/mojang')

const routes = [
    {
        method: "GET",
        url: "/mojang/*",
        handler: mojang,
    },
];

module.exports = routes;