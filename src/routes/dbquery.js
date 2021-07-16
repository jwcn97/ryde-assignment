const db = require('../config/database.js');

const dbQuery = async ({
    query = '',
    successCallback = () => {},
    failureCallback = () => {},
}) => {
    return await db
        .any(query)
        .then((data) => {
            console.log(`[dbquery]: ${query}`);
            return successCallback(data);
        })
        .catch((error) => {
            console.error(`[dbquery]: ${query}`);
            return failureCallback(error);
        });
};

module.exports = dbQuery;
