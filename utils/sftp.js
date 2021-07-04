let Client = require("ssh2-sftp-client");
let sftp = new Client();

const env = require("../envs");

const config = {
    host: env.FTPhost,
    port: env.FTPport,
    username: env.FTPuser,
    password: env.FTPpass,
};

const downloadFile = async (remotePath, localPath) => {
    await sftp.connect(config);
    await sftp.fastGet(remotePath, localPath);
    await sftp.end();
};

module.exports = {
    downloadFile,
};
