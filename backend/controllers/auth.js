const request = require('superagent');

exports.githubSignIn = (req, res, next) => {
  console.log('***************** githubSignIn body *************** ', req.body);
  const { query } = req.body;
  const code = req.body.code;

  if(!code) {
    return res.send({
      success: false,
      message: 'Error: no code'
    });
  }

  // Post
  console.log('code: ', code);
  request
    .post('https://github.com/login/oauth/access_token')
    .send({
      client_id: '8eee574d84d9fd8f73bd',
      client_secret: '530d3713b14ed6e52b40d0c0200dfcc7fa6f0673',
      code: code
    })
    .set('X-API-Key', 'foobar')
    .set('Accept', 'application/json')
    .then(result => {
      const data = result.body;
      res.send(data);
    });


};

exports.githubUser = (req, res, next) => {

  console.log('***************** githubUser ****************** ', req.body);
  const accessToken = req.body.token;

  request
    .get('https://api.github.com/user')
    .set('Authorization', 'token ' + accessToken)
    .set('user-agent', 'node.js')
    .then(result => {
      res.send(result.body);
    })
    .catch((error) => {
      console.log('*** error ****', error);
    });
};
