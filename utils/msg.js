module.exports = {
    error: (msg, err, code) => {
        return {
            messsage: msg,
            error: err,
            statusCode: code,
        };
    },
};
