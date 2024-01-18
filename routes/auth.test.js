const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
    await sequelize.sync();
});

describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email: 'yeseul@epcot.co.kr',
                nick: 'yeseul',
                password: '1234',
            })
            .expect('Location','/')
            .expect(302, done);
    });
});

describe('POST /join', () => {
    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'yeseul@epcot.co.kr',
                password: '1234',
            })
            .end(done);
    });

    test('이미 로그인 했으면 redirect /', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent
            .post('/auth/join')
            .send({
                email: 'yeseul@epcot.co.kr',
                nick: 'yeseul',
                password: '1234',
            })
            .expect('Location',`/?error=${message}`)
            .expect(302, done);
    });
});

afterAll(async () => {
    await sequelize.sync({force: true});
});