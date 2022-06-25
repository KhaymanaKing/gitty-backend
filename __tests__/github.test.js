const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
jest.mock('../lib/services/github');
const agent = request.agent(app);

describe('auth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should redirect to the github oauth page upon login', async () => {
    const res = await agent.get('/api/v1/github/login');
    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/callback/i
    );
  });

  it('should login and redirect users to /api/v1/github/dashboard', async() => {
    const res = await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_GH_user',
      avatar: 'https://www.placedog.com/200/200',
      email: 'fake-email@wowowow.com',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('logins a user and then signs them out', async() => {
    const loginRes = await agent
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(loginRes.body).toEqual({
      id: expect.any(String),
      username: 'fake_GH_user',
      avatar: 'https://www.placedog.com/200/200',
      email: 'fake-email@wowowow.com',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
    const res = await agent.delete('/api/v1/github/sessions');
    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });
  afterAll(() => {
    pool.end();
  });
});
