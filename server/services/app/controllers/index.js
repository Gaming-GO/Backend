const { User, Device, Category, Transaction, Detail, sequelize, Sequelize } = require('../models');
const { signToken } = require('../helpers/jwt');
const { comparePassword } = require('../helpers/bcrypt');
const midtransClient = require('midtrans-client');

class Controllers {
  static async custRegister(req, res) {
    try {
      const { username, email, password, long, lat, phoneNumber, address, nik } = req.body;
      const newUser = await User.create({ username, email, password, location: Sequelize.fn(`ST_GeomFromText`, `POINT(${long} ${lat})`), role: 'customer', phoneNumber, address, nik, approved: false });

      await Transaction.create({ UserId: newUser.id });

      res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role });
    } catch (error) {
      console.log(error);
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
      await Device.create({ name, description, imgUrl, price, specs, UserId: req.user.id, CategoryId, status: 'Available', location: req.user.location });

      res.status(201).json({ message: 'Success posted device' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async rent(req, res) {
    const t = await sequelize.transaction();
    try {
      const { rentEnd } = req.body;
      const { deviceId } = req.params;
      const device = await Device.findByPk(deviceId);
      if (!device) throw { name: 'not_found' };

      const date = new Date();
      const todayDate = date.getDate();
      const untill = date.setDate(todayDate + rentEnd);

      const findTransaction = await Transaction.findOne({ where: { UserId: req.user.id } });
      await Transaction.update({ totalPrice: findTransaction.totalPrice + device.price }, { where: { id: findTransaction.id } }, { transaction: t });

      await Detail.create({ TransactionId: findTransaction.id, DeviceId: device.id, price: device.price, rentDate: new Date(), rentEnd: untill }, { transaction: t });

      await t.commit();
      res.status(201).json({ message: 'Success add to transaction' });
    } catch (error) {
      await t.rollback();
      if (error.name == 'not_found') {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async fetchTransactions(req, res) {
    try {
      const findTransaction = await Transaction.findOne({ where: { UserId: req.user.id } });
      const findDetails = await Detail.findAll({ where: { TransactionId: findTransaction.id }, include: Device });
      const data = { Transaction: findTransaction, Details: findDetails };
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // static async pay(req, res) {
  //   const t = await sequelize.transaction();
  //   try {
  //     const findTransaction = await Transaction.findOne({ where: { UserId: req.user.id } });
  //     await Transaction.update({ totalPrice: 0 }, { where: { UserId: req.user.id } }, { transaction: t });
  //     await Detail.destroy({ where: { TransactionId: findTransaction.id } }, { transaction: t });

  //     await t.commit();
  //     res.status(200).json({ message: 'Payment success' });
  //   } catch (error) {
  //     await t.rollback();
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // }

  // =========== MIDTRANS ============
  static async pay(req, res) {
    // const t = await sequelize.transaction();
    try {
      const user = await User.findByPk(req.user.id);
      const findTransaction = await Transaction.findOne({ where: { UserId: req.user.id } });
      // await Transaction.update({ totalPrice: 0 }, { where: { UserId: req.user.id } }, { transaction: t });
      // await Detail.destroy({ where: { TransactionId: findTransaction.id } }, { transaction: t });

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: 'SB-Mid-server-SzvLU8-lfRmFVnxaY01g7dL6',
      });

      let parameter = {
        transaction_details: {
          order_id: 'TRANSACTIONS_' + Math.floor(100000 + Math.random() * 900000),
          gross_amount: findTransaction.totalPrice,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          name: user.name,
          email: user.email,
        },
      };

      const midtransToken = await snap.createTransaction(parameter);

      // await t.commit();
      // res.status(200).json({ message: 'Payment success' });
      res.status(200).json({ midtransToken });
    } catch (error) {
      // await t.rollback();
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async checkout(req, res) {
    const t = await sequelize.transaction();
    try {
      // const user = await User.findByPk(req.user.id);
      const findTransaction = await Transaction.findOne({ where: { UserId: req.user.id } });
      await Transaction.update({ totalPrice: 0 }, { where: { UserId: req.user.id } }, { transaction: t });
      await Detail.destroy({ where: { TransactionId: findTransaction.id } }, { transaction: t });

      await t.commit();
      res.status(200).json({ message: 'Payment success' });
    } catch (error) {
      console.log(error, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<+++++++++++++++++++++++++++++++++++++++++++');
      await t.rollback();
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  // =================================

  static async nearest(req, res) {
    try {
      // distance on meter unit
      const distance = req.query.distance || 15000;
      // const long = req.query.long || '-6.9439994342171225';
      // const lat = req.query.lat || '107.5904275402039';

      console.log('cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc');
      console.log(req.user);
      console.log('cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc');

      let long;
      let lat;
      if (req.user.location) {
        long = `${req.user.location.coordinates[1]}`;
        lat = `${req.user.location.coordinates[0]}`;
      } else {
        long = '-6.9439994342171225';
        lat = '107.5904275402039';
      }

      console.log(req.user.location);
      console.log({ long, lat });

      const result = await sequelize.query(
        `select
        id,
        name,
        description,
        "imgUrl",
        price,
        specs,
        "CategoryId",
        status
      from
        "Devices"
      where
        ST_DWithin(location,
        ST_MakePoint(:lat,
        :long),
        :distance,
      true) = true;`,
        {
          replacements: {
            distance: +distance,
            long: parseFloat(long),
            lat: parseFloat(lat),
          },
          logging: console.log,
          plain: false,
          raw: false,
          type: sequelize.QueryTypes.SELECT,
        }
      );
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

module.exports = Controllers;
