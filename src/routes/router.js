const express = require('express');
const router = express.Router();
const logger = require('../logger');

// log requests
router.use('*', (req, res, next) => {
    logger.info(`[api]: ${req.method} ${req.baseUrl}`);
    next();
});

// add single router files
const routeFiles = ['user'];
routeFiles.forEach((route) => {
    let routeFile = require(`./${route}.js`);
    try {
        router.use(`/${route}`, routeFile);
    } catch (err) {
        logger.error(`[route] Router file ${routeFile} does not exists.`);
    }
});

module.exports = router;
