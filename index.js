const fs = require("fs");
const app = require("fastify")({
    logger: true,
});
const logs = require("./utils/logs");

require("dotenv").config();
const port = process.env.PORT;

// Rate limit
app.register(require("fastify-rate-limit"), {
    max: 60,
    timeWindow: "1 minute",
});

// Swagger docs
app.register(require("fastify-swagger"), {
    exposeRoute: true,
    routePrefix: "/docs",
    mode: "static",
    specification: {
        path: "./openapi.json",
        postProcessor: (swaggerObject) => {
            return swaggerObject;
        },
    },
});

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
