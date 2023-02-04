const { User, Device, Category, Transaction, Detail } = require('../models');
const { signToken } = require('../helpers/jwt');
const { comparePassword } = require('../helpers/bcrypt');

class Controllers {
  static async custRegister(req, res) {
    try {
      const { username, email, password, location, phoneNumber, address, nik } = req.body;
      const newUser = await User.create({ username, email, password, location, role: 'customer', phoneNumber, address, nik, approved: false });

      await Transaction.create({ UserId: newUser.id });

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

  static async fetchDevices(req, res) {
    try {
      const data = await Device.findAll();

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async fetchDeviceById(req, res) {
    try {
      const { id } = req.params;
      const data = await Device.findByPk(id, { include: { model: User, attributes: { exclude: ['password'] } } });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async fetchCategories(req, res) {
    try {
      const data = await Category.findAll();

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async fetchCategoryByid(req, res) {
    try {
      const { id } = req.params;
      const data = await Category.findByPk(id, { include: { model: Device } });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async postDevice(req, res) {
    try {
      // res.status(200).json({ message: 'OKKK' });
      const { name, description, imgUrl, price, specs, CategoryId } = req.body;
      await Device.create({ name, description, imgUrl, price, specs, UserId: req.user.id, CategoryId, status: 'Available' });

      res.status(201).json({ message: 'Success posted device' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // ==
  static async rent(req, res) {
    try {
      const { rentEnd } = req.body;
      const { deviceId } = req.params;
      const device = await Device.findByPk(deviceId);
      if (!device) throw { name: 'not_found' };

      const date = new Date();
      const todayDate = date.getDate();
      const untill = date.setDate(todayDate + rentEnd);
      await Detail.create({ DeviceId: device.id, rentDate: new Date(), rentEnd: untill });
      res.status(201).json({ message: 'Success add to transaction' });
    } catch (error) {
      if (error.name == 'not_found') {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = Controllers;
