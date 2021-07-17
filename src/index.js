const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());

// add router for all routes
const router = require('./routes/router.js');
app.use('/api', router);

// handle unhandled 404 requests
app.use('*', (req, res) => {
    console.log(`[route]: Route does not exists: ${req.baseUrl}`);
    res.status(404).send('request not found');
});

// start server
app.listen(process.env.PORT, () =>
    console.log(`[app]: Server running on port ${process.env.PORT}`)
);

module.exports = app;
