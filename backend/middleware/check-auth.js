const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {login: decodedToken.login, userId: decodedToken.id };
    next();
  } catch(error) {
    console.log('CheckAuth error : ', error);
    res.status(401).json({ message: 'Authorization Failed!!'})
  }

};
