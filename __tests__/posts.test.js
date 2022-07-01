const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { Post } = require('../lib/models/Posts');
jest.mock('../lib/services/github');

const agent = request.agent(app);
describe('post routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('should login in a user and check posts', async() => {
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
    const postRes = await agent.get('/api/v1/posts');
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

it('should login a user and create a post ', async() => {
  // const agent =  agent.request(app);
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
  const res =  await agent
    .post('/api/v1/posts')
    .send({
      post: 'Hey man look this is working and its cool and stuff I think?'
    });
  expect(res.status).toBe(200);
  expect(res.body.post)
    .toEqual('Hey man look this is working and its cool and stuff I think?');

    
});
afterAll(() => {
  pool.end();
});
