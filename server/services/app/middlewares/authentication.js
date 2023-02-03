const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) throw { name: 'invalid_token' };

    const payload = verifyToken(access_token);
    // console.log(payload);
    const findUser = await User.findByPk(payload.id);
    if (!findUser) throw { name: 'invalid_token' };

    req.headers = {
      id: findUser.id,
    };

    next();
  } catch (error) {
    // console.log(error);

    if (error.name == 'invalid_token' || error.name == 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = authentication;
