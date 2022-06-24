/* eslint-disable no-console */

const exchangeCodeForToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeCodeForToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const getGitHubProfile = async (token) => {
  console.log(`MOCK INVOKED: getGithubProfile(${token})`);
  return{
    log: 'fake_github_user',
    avatar_url: 'https://www.placedog.com/200/200',
    email: 'fake-email@wowowow.com',
  };
};

module.exports = { exchangeCodeForToken, getGitHubProfile };
