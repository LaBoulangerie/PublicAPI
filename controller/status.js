const fetch = require("node-fetch");
const logs = require("../utils/logs");
const msg = require("../utils/msg");
const env = require("../envs");

const BASE_URL = "https://api.mcsrvstat.us/2/";

const getStatus = () => {
    return fetch(BASE_URL + env.MCIP).then((res) => res.json());
};

module.exports = { getStatus };
