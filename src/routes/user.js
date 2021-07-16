const express = require('express');
const router = express.Router();
const dbQuery = require('./dbquery');

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

module.exports = router;
