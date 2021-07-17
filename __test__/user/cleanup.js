const supertest = require('supertest');
const app = require('../../src/index');

// to prepare user object for test case
const setup = async () => {
    const response = await supertest(app)
        .post('/api/user')
        .set('Content-type', 'application/json')
        .send({
            name: 'test',
            dob: '24/8/1997',
            address: 'county road',
            description: 'description',
        });

    if (response.ok) return response.body.user_id;
};

// to teardown user object used for test case
const teardown = async (id) => {
    if (!id) return;
    await supertest(app).delete(`/api/user/${id}`);
};

module.exports = { setup, teardown };
