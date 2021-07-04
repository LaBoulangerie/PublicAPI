const app = require("fastify")({ logger: true });
const fs = require("fs");
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
