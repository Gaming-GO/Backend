const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) throw { name: 'invalid_token' };

    const payload = verifyToken(access_token);

    const findUser = await User.findOne({ where: { id: payload.id } });

    if (!findUser) {
      throw { name: 'invalid_token' };
    }

    req.user = {
      id: findUser.id,
      location: findUser.location,
    };

    next();
  } catch (error) {
    if (error.name == 'invalid_token' || error.name == 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = authentication;
