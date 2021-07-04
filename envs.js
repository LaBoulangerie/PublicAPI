require("dotenv").config();

module.exports = {
    port: process.env.PORT,

    MCIP: process.env.MC_IP,

    SQLhost: process.env.SQL_HOST,
    SQLbase: process.env.SQL_DATABASE,
    SQLuser: process.env.SQL_USER,
    SQLpass: process.env.SQL_PASSWORD,

    FTPhost: process.env.FTP_HOST,
    FTPport: process.env.FTP_PORT,
    FTPuser: process.env.FTP_USER,
    FTPpass: process.env.FTP_PASSWORD,
};
