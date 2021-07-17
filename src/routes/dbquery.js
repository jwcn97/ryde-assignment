const db = require('../config/database.js');
const logger = require('../logger');

const dbQuery = async ({
    query = '',
    successCallback = () => {},
    failureCallback = () => {},
}) => {
    return await db
        .any(query)
        .then((data) => {
            logger.debug(`[dbquery]: ${query}`);
            return successCallback(data);
        })
        .catch((error) => {
            logger.error(`[dbquery]: ${query}`);
            return failureCallback(error);
        });
};

module.exports = dbQuery;
