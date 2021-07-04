const { connectSQL } = require("../utils/sql");
const logs = require("../utils/logs");
const msg = require("../utils/msg");
const towny = require("../utils/towny");
const { getStatus } = require("./status");
const { getGroups, getUserData } = require("../utils/player");

const getAllPlayers = async (req, res) => {
    let players = [];
    connectSQL.query(
        "SELECT name,uuid FROM TOWNY_RESIDENTS",
        (error, results, fields) => {
            if (error) return console.log(logs.tag.err, err);
            results.forEach((result) => {
                players.push({
                    uuid: result.uuid,
                    username: result.name,
                });
            });
            res.send(players);
        }
    );
};

const getPlayer = (req, res) => {
    let player = req.query.uuid
        ? req.query.uuid
        : req.query.name
        ? req.query.name
        : null;

    if (!player)
        return msg.error(
            "Request needs 'name' or 'uuid' query strings",
            "Bad Request",
            400
        );

    let SQLQuery = req.query.uuid
        ? `SELECT * FROM TOWNY_RESIDENTS WHERE uuid = '${player}'`
        : req.query.name
        ? `SELECT * FROM TOWNY_RESIDENTS WHERE name = '${player}'`
        : null;

    connectSQL.query(SQLQuery, async (error, results, fields) => {
        if (error) return console.log(logs.tag.err, err);
        let playerData = results[0];
        if (!playerData)
            return res.send(
                msg.error(`Player ${player} not found`, "Not found", 404)
            );

        // Parsing arrays
        playerData.townRanks = towny.array.parse(playerData["town-ranks"], "#");
        delete playerData["town-ranks"];
        playerData.nationRanks = towny.array.parse(
            playerData["nation-ranks"],
            "#"
        );
        delete playerData["nation-ranks"];

        playerData.protectionStatus = towny.array.parse(
            playerData.protectionStatus,
            "#"
        );
        playerData.friends = towny.array.parse(playerData.friends, "#");

        // Parsing metadata
        playerData.metadata = towny.metadata.parse(playerData.metadata);

        // Parsing booleans
        playerData.isNPC = towny.symbolToBool(playerData.isNPC);
        playerData.isJailed = towny.symbolToBool(playerData.isJailed);

        // Extra stuff
        let onlinePlayers = (await getStatus()).players.list;
        playerData.isOnline = onlinePlayers
            ? onlinePlayers.includes(playerData.name)
            : false;

        playerData.groups = await getGroups(playerData.uuid);
        let userData = await getUserData(playerData.uuid);

        playerData.money = parseFloat(userData.money).toFixed(2);
        playerData.logoutLocation = userData.logoutLocation;
        playerData.afk = userData.afk;
        playerData.nickname = userData.nickname;
        playerData.timestamps = userData.timestamps;

        return res.send(playerData);
    });
};

module.exports = { getAllPlayers, getPlayer };
