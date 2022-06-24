const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { Post } = require('../lib/models/Posts');
jest.mock('../lib/services/github');


describe('auth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should redirect to the github oauth page upon login', async () => {
    const res = await request(app).get('/api/v1/github/login');
    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/callback/i
    );
  });

  it('should login and redirect users to /api/v1/github/dashboard', async() => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      avatar: 'https://www.placedog.com/200/200',
      email: 'fake-email@wowowow.com',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
    const postRes = await request.agent(app).get('/posts');
    const posts = await Post.getAll();
    const expected = posts.map((post) => {
      return{
        id: post.id,
        post: expect.any(String)
      };
    });
    expect(res.body).toEqual(expected);
  });
  afterAll(() => {
    pool.end();
  });
});
