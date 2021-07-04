const { connectSQL } = require("./sql");

module.exports = {
    array: {
        parse: (array, sep) => {
            if (!array.length) return [];
            return array.split(sep);
        },
    },

    symbolToBool: (symbol) => {
        switch (symbol.toString().toLowerCase()) {
            case "false":
            case "no":
            case "0":
            case "":
                return false;
            default:
                return true;
        }
    },

    coords: {
        parse: (coord) => {
            let coordInfo = module.exports.array.parse(coord, "#");
            return {
                world: coordInfo[0],
                x: coordInfo[1],
                y: coordInfo[2],
                z: coordInfo[3],
                pitch: coordInfo[4],
                yaw: coordInfo[5],
            };
        },

        parseArray: (coords) => {
            let coordsParsed = [];
            let coordsArray = module.exports.array.parse(coords, ";");
            coordsArray.pop(); // last ";"
            coordsArray.forEach((coord) => {
                coordsParsed.push(module.exports.coords.parse(coord));
            });
            return coordsParsed;
        },
    },

    metadata: {
        parse: (metadata) => {
            if (!metadata) return "";
            let parsedDataArray = JSON.parse(metadata);
            let parsedData = {};

            parsedDataArray.forEach((data) => {
                switch (data[0]) {
                    case "towny_longdf":
                        parsedData[data[1]] = Number(data[2]);
                        break;
                    case "towny_booldf":
                        parsedData[data[1]] = module.exports.symbolToBool(
                            data[1]
                        );
                        break;
                }
            });
            return parsedData;
        },
    },

    town: {
        getResidents: (town) => {
            return new Promise((resolve, reject) => {
                connectSQL.query(
                    `SELECT * FROM TOWNY_RESIDENTS WHERE town = '${town}'`,
                    (error, results, fields) => {
                        if (error) return reject(error);
                        let residents = results.map((resident) => {
                            return { name: resident.name, uuid: resident.uuid };
                        });
                        resolve(residents);
                    }
                );
            });
        },
    },

    nation: {
        getTowns: (nation) => {
            return new Promise((resolve, reject) => {
                connectSQL.query(
                    `SELECT * FROM TOWNY_TOWNS WHERE nation = '${nation}'`,
                    (error, results, fields) => {
                        if (error) return reject(error);
                        let towns = results.map((town) => {
                            return { name: town.name, uuid: town.uuid };
                        });
                        resolve(towns);
                    }
                );
            });
        },
    },
};
