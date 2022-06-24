const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { Post } = require('../lib/models/Posts');
jest.mock('../lib/services/github');

describe('post routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('should login in a user and check posts', async() => {
    const loginRes = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(loginRes.body).toEqual({
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
    expect(postRes.body).toEqual(expected);
  });
});
afterAll(() => {
  pool.end();
});
