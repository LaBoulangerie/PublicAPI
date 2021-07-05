const { connectSQL } = require("../utils/sql");
const logs = require("../utils/logs");
const msg = require("../utils/msg");
const utils = require("../utils/towny");

const getAllTowns = async (req, res) => {
    let towns = [];
    connectSQL.query(
        "SELECT name,uuid FROM TOWNY_TOWNS",
        (error, results, fields) => {
            if (error) return console.log(logs.tag.err, err);
            results.forEach((result) => {
                towns.push({
                    uuid: result.uuid,
                    name: result.name,
                });
            });
            res.send(towns);
        }
    );
};

const getTown = (req, res) => {
    let town = req.query.uuid
        ? req.query.uuid
        : req.query.name
        ? req.query.name
        : null;

    if (!town)
        return msg.error(
            "Request needs 'name' or 'uuid' query strings",
            "Bad Request",
            400
        );

    let SQLQuery = req.query.uuid
        ? `SELECT * FROM TOWNY_TOWNS WHERE uuid = '${town}'`
        : req.query.name
        ? `SELECT * FROM TOWNY_TOWNS WHERE name = '${town}'`
        : null;

    connectSQL.query(SQLQuery, async (error, results, fields) => {
        if (error) return console.log(logs.tag.err, err);
        let townData = results[0];

        if (!townData)
            return res.send(
                msg.error(`Town ${town} not found`, "Not found", 404)
            );

        // Add town residents
        townData.residents = await utils.town.getResidents(town);

        // Parsing arrays
        townData.protectionStatus = utils.array.parse(
            townData.protectionStatus,
            "#"
        );

        // Parsing coordinates
        townData.homeblock = utils.coords.parse(townData.homeblock);
        townData.spawn = utils.coords.parse(townData.spawn);
        townData.outpostSpawns = utils.coords.parseArray(
            townData.outpostSpawns
        );
        townData.jailSpawns = utils.coords.parseArray(townData.jailSpawns);

        // Parsing metadata
        townData.metadata = utils.metadata.parse(townData.metadata);

        // Parsing booleans
        townData.hasUpkeep = utils.symbolToBool(townData.hasUpkeep);
        townData.open = utils.symbolToBool(townData.open);
        townData.public = utils.symbolToBool(townData.public);
        townData.admindisabledpvp = utils.symbolToBool(
            townData.admindisabledpvp
        );
        townData.adminenabledpvp = utils.symbolToBool(townData.adminenabledpvp);
        townData.conquered = utils.symbolToBool(townData.conquered);
        townData.ruined = utils.symbolToBool(townData.ruined);
        townData.neutral = utils.symbolToBool(townData.neutral);

        return res.send(townData);
    });
};

module.exports = { getAllTowns, getTown };
