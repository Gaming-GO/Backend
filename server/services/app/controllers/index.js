const { User } = require('../models');
const { signToken } = require('../helpers/jwt');
const { comparePassword } = require('../helpers/bcrypt');

class Controllers {
  static async custRegister(req, res) {
    try {
      const { username, email, password, location, role, phoneNumber, address, nik } = req.body;
      const newUser = await User.create({ username, email, password, location, role, phoneNumber, address, nik, approved: false });

      res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role });
    } catch (error) {
      if (error.name == 'SequelizeUniqueConstraintError' || error.name == 'SequelizeValidationError') {
        res.status(400).json({ message: error.errors[0].message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async custLogin(req, res) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: 'empty_email' };
      if (!password) throw { name: 'empty_password' };

      const findUser = await User.findOne({ where: { email } });
      if (!findUser) throw { name: 'invalid' };

      const valid = comparePassword(password, findUser.password);
      if (!valid) throw { name: 'invalid' };

      const access_token = signToken({ id: findUser.id });
      res.status(200).json({ access_token });
    } catch (error) {
      // console.log(error);
      if (error.name == 'empty_email') {
        res.status(400).json({ message: 'Email is required' });
        return;
      }
      if (error.name == 'empty_password') {
        res.status(400).json({ message: 'Password is required' });
        return;
      }
      if (error.name == 'invalid') {
        res.status(401).json({ message: 'Invalid email/password' });
        return;
      }
      res.status(500).json({ message: 'Internal server error', error });
    }
  }
}

module.exports = Controllers;
