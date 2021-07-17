const supertest = require('supertest');
const app = require('../../src/index');
const { setup, teardown } = require('./cleanup');

describe('Testing the POST API', () => {
    let userId;

    it('create user', async () => {
        const response = await supertest(app)
            .post('/api/user')
            .set('Content-type', 'application/json')
            .send({
                name: 'test',
                dob: '24/8/1997',
                address: 'county road',
                description: 'description',
            });

        if (response.ok) userId = response.body.user_id;

        expect(response.statusCode).toBe(200);

        await teardown(userId);
    });
});

describe('Testing the PATCH API', () => {
    it('update user info', async () => {
        const userId = await setup();

        const response = await supertest(app)
            .patch(`/api/user/${userId}`)
            .set('Content-type', 'application/json')
            .send({
                name: 'another name',
                dob: '24/8/1997',
                address: 'county road',
                description: 'description is changed',
            });

        expect(response.statusCode).toBe(200);

        await teardown(userId);
    });
});

describe('Testing the GET API', () => {
    it('get all users', async () => {
        const response = await supertest(app).get('/api/user');
        expect(response.statusCode).toBe(200);
    });

    it('get a single user', async () => {
        const userId = await setup();
        const response = await supertest(app).get(`/api/user/${userId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('dob');
        expect(response.body).toHaveProperty('address');
        expect(response.body).toHaveProperty('latitude');
        expect(response.body).toHaveProperty('longitude');
        expect(response.body).toHaveProperty('description');

        await teardown(userId);
    });
});

describe('Testing the DELETE API', () => {
    it('delete a single user', async () => {
        const userId = await setup();
        const response = await supertest(app).delete(`/api/user/${userId}`);
        expect(response.statusCode).toBe(204);
    });
});
