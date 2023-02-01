const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const signToken = (payload) => {
  return jwt.signToken(payload, SECRET);
};

const verifyToken = (access_token) => {
  return jwt.verifyToken(access_token, SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};
