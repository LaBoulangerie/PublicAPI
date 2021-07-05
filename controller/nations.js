const { connectSQL } = require("../utils/sql");
const logs = require("../utils/logs");
const msg = require("../utils/msg");
const utils = require("../utils/towny");

const getAllNations = async (req, res) => {
    let nations = [];
    connectSQL.query(
        "SELECT name,uuid FROM TOWNY_NATIONS",
        (error, results, fields) => {
            if (error) return console.log(logs.tag.err, err);
            results.forEach((result) => {
                nations.push({
                    uuid: result.uuid,
                    name: result.name,
                });
            });
            res.send(nations);
        }
    );
};

const getNation = (req, res) => {
    let nation = req.query.uuid
        ? req.query.uuid
        : req.query.name
        ? req.query.name
        : null;

    if (!nation)
        return msg.error(
            "Request needs 'name' or 'uuid' query strings",
            "Bad Request",
            400
        );

    let SQLQuery = req.query.uuid
        ? `SELECT * FROM TOWNY_NATIONS WHERE uuid = '${nation}'`
        : req.query.name
        ? `SELECT * FROM TOWNY_NATIONS WHERE name = '${nation}'`
        : null;

    connectSQL.query(SQLQuery, async (error, results, fields) => {
        if (error) return console.log(logs.tag.err, err);
        let nationData = results[0];

        if (!nationData)
            return res.send(
                msg.error(`Nation ${nation} not found`, "Not found", 404)
            );

        // Add town residents
        nationData.towns = await utils.nation.getTowns(nation);

        // Parsing coordinates
        nationData.nationSpawn = utils.coords.parse(nationData.nationSpawn);

        // Parsing metadata
        nationData.metadata = utils.metadata.parse(nationData.metadata);

        // Parsing booleans
        nationData.isOpen = utils.symbolToBool(nationData.isOpen);
        nationData.isPublic = utils.symbolToBool(nationData.isPublic);
        nationData.neutral = utils.symbolToBool(nationData.neutral);

        return res.send(nationData);
    });
};

module.exports = { getAllNations, getNation };
