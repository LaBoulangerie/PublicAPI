const chalk = require("chalk");

module.exports = {
    tag: {
        info: chalk.black.bgGreen(" INFO ") + " %s",
        warn: chalk.black.bgYellow(" WARN ") + " %s",
        err: chalk.black.bgRed(" ERROR ") + " %s",
    },
};
