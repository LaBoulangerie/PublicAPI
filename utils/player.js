const yaml = require("js-yaml");
const fs = require("fs");
const { downloadFile } = require("./sftp");
const { connectSQL } = require("./sql");

const getGroups = (uuid) => {
    return new Promise((resolve, reject) => {
        connectSQL.query(
            `SELECT * FROM luckperms_user_permissions WHERE uuid = '${uuid}'`,
            (error, results, fields) => {
                let groups = [];

                results.forEach((group) => {
                    if (group.permission.startsWith("group.")) {
                        groups.push(group.permission.replace("group.", ""));
                    }
                });

                resolve(groups);
            }
        );
    });
};

const getUserData = async (uuid) => {
    await downloadFile(
        `/plugins/Essentials/userdata/${uuid}.yml`,
        `./tmp/${uuid}.yml`
    );

    let userDataObj = yaml.load(
        fs.readFileSync(`./tmp/${uuid}.yml`, { encoding: "utf-8" })
    );

    fs.unlinkSync(`./tmp/${uuid}.yml`);

    return userDataObj;
};

module.exports = {
    getGroups,
    getUserData,
};
