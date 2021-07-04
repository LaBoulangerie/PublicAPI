const fs = require("fs");
const path = require('path')
const app = require("fastify")({
    logger: true,
});

app.register(require("fastify-static"), {
    root: path.join(__dirname, "doc"),
});

const logs = require("./utils/logs");

require("dotenv").config();
const port = process.env.PORT;

// Routes handler
const routesFolder = fs.readdirSync("./routes");
for (const routeFile of routesFolder) {
    const route = require("./routes/" + routeFile);
    route.forEach((route, index) => {
        app.route(route);
    });
}

app.get("/docs", (req, res) => {
    return res.sendFile("index.html");
});

const start = async () => {
    try {
        await app.listen(port, "0.0.0.0");
        console.log(logs.tag.info, "Ready on " + port);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
