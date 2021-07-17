const express = require('express');
const router = express.Router();
const dbQuery = require('./dbquery');
const isNumeric = require('../helper/util');
const calculateEuclideanRange = require('../helper/distance');

router.get('/', async (req, res, next) => {
    const response = await dbQuery({
        query: 'select * from get_users()',
        successCallback: (data) => {
            res.statusCode = 200;
            return data;
        },
        failureCallback: (error) => {
            res.statusCode = 400;
            return error;
        },
    });

    res.send(response);
});

router.post('/', async (req, res, next) => {
    const response = await dbQuery({
        query: `select * from add_user($$${JSON.stringify(req.body)}$$)`,
        successCallback: (data) => {
            res.statusCode = 200;
            return {
                user_id: data[0].add_user,
            };
        },
        failureCallback: (error) => {
            res.statusCode = 400;
            return error;
        },
    });

    res.send(response);
});

router.get('/:id', async (req, res, next) => {
    const user_id = req.params.id;

    const response = await dbQuery({
        query: `select * from get_user_by_id(${user_id})`,
        successCallback: (data) => {
            res.statusCode = 200;
            return data.length > 0 ? data[0] : {};
        },
        failureCallback: (error) => {
            res.statusCode = 400;
            return error;
        },
    });

    res.send(response);
});

router.patch('/:id', async (req, res, next) => {
    const user_id = req.params.id;

    const response = await dbQuery({
        query: `select * from update_user(${user_id}, $$${JSON.stringify(
            req.body
        )}$$)`,
        successCallback: (data) => {
            if (data[0].update_user === 0) {
                res.statusCode = 400;
                return 'user not found';
            }
            res.statusCode = 200;
            return 'success';
        },
        failureCallback: (error) => {
            res.statusCode = 400;
            return error;
        },
    });

    res.send(response);
});

router.delete('/:id', async (req, res, next) => {
    const user_id = req.params.id;

    const response = await dbQuery({
        query: `select * from delete_user(${user_id})`,
        successCallback: (data) => {
            res.statusCode = 204;
            return data;
        },
        failureCallback: (error) => {
            res.statusCode = 400;
            return error;
        },
    });

    res.send(response);
});

router.get('/nearby/:name/:radius?', async (req, res, next) => {
    const name = req.params.name;
    const radius = req.params.radius;

    // find lat and long positions of user with name <name>
    const userResponse = await dbQuery({
        query: `select * from get_user_by_name($$${name}$$)`,
        successCallback: (data) => {
            res.statusCode = 200;
            return data.length > 0 ? data[0] : { id: -1 };
        },
        failureCallback: (error) => {
            res.statusCode = 400;
            return error;
        },
    });

    let response = [];

    if (res.statusCode === 200) {
        // get the lat and long range
        const euclideanRange = calculateEuclideanRange(
            userResponse,
            isNumeric(radius) ? radius : undefined
        );
        const [min_lat, max_lat] = euclideanRange.lat_range;
        const [min_long, max_long] = euclideanRange.long_range;

        // find list of nearby users based on lat and long range
        response = await dbQuery({
            query: `select * from find_nearby_users(${userResponse.id}, ${max_lat}, ${min_lat}, ${max_long}, ${min_long})`,
            successCallback: (data) => {
                res.statusCode = 200;
                return data;
            },
            failureCallback: (error) => {
                res.statusCode = 400;
                return error;
            },
        });
    }

    res.send(response);
});

module.exports = router;
