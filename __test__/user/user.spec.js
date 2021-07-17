const supertest = require('supertest');
const app = require('../../src/index');
const { setup, teardown } = require('./cleanup');

describe('Testing the GET API', () => {
    it('get all users', async () => {
        const response = await supertest(app).get('/api/user');
        expect(response.statusCode).toBe(200);
    });
});
