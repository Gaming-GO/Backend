const { User } = require('../models');
const { signToken } = require('../helpers/jwt');
const { comparePassword } = require('../helpers/bcrypt');
const { Op } = require('sequelize');
class Controllers {
  static async register(req, res) {
    try {
      const { email, password } = req.body;
      const newUser = await User.create({ email, password, role: 'admin' });

      res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role });
    } catch (error) {
      //   console.log(error);
      if (error.name == 'SequelizeUniqueConstraintError' || error.name == 'SequelizeValidationError') {
        res.status(400).json({ message: error.errors[0].message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async login(req, res) {
    try {
      console.log('masukkk');
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
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async fetchUsers(req, res) {
    try {
      const data = await User.findAll({ where: { role: { [Op.notILike]: '%admin%' } }, attributes: { exclude: ['password'] } });
      // const data = await User.findAll();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async fetchUserById(req, res) {
    try {
      const { id } = req.params;
      const data = await User.findByPk(id, { attributes: { exclude: ['password'] } });
      if (!data) throw { name: '404' };

      res.status(200).json(data);
    } catch (error) {
      if (error.name == '404') {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateUser(req, res) {
    try {
      // const {} = req.body;
      const { id } = req.params;
      // const findUser = await User.findByPk(id);
      await User.update({ approved: true }, { where: { id } });
      res.status(200).json({ message: 'User has been approved' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = Controllers;
