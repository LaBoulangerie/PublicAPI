const mysql = require("mysql");
const env = require("../envs");

const connectSQL = mysql.createPool({
    host: env.SQLhost,
    user: env.SQLuser,
    password: env.SQLpass,
    database: env.SQLbase,
});

module.exports = { connectSQL };
