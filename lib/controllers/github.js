const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GitHubUser = require('../models/GithubUser');
const { Router } = require('express');
const { exchangeCodeForToken, getGitHubProfile } = require('../services/github');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user&redirect_uri=${process.env.GITHUB_REDIRECT_URI}`
    );
  })
  .get('/callback', async(req, res, next) => {
    try{
      const { code } = req.query;
      const token = await exchangeCodeForToken(code);
      const gitHubProfile = await getGitHubProfile(token);


      let user = await GitHubUser.findByUsername(gitHubProfile.login);   
      if(!user) {
        user = await GitHubUser.insert({
          username: gitHubProfile.login,
          email: gitHubProfile.email,
          avatar: gitHubProfile.avatar_url,
        });
      }
      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      res.cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
        .redirect('/api/v1/github/dashboard');
    } catch (e){
      next (e);
    }
  })
  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  })
  .delete('/sessions', (req, res, next) => {
    try{
      res
        .clearCookie(process.env.COOKIE_NAME)
        .json({ success: true, message: 'Signed out successfully!' });
    } catch(e){
      next (e);
    }
  });

