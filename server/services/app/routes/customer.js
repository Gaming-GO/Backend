const express = require('express');
const Controllers = require('../controllers');
const authentication = require('../middlewares/authentication');
const router = express.Router();

router.post('/register', Controllers.custRegister);
router.post('/login', Controllers.custLogin);
router.get('/devices', Controllers.fetchDevices);
router.get('/devices/:id', Controllers.fetchDeviceById);
router.get('/categories', Controllers.fetchCategories);
router.get('/categories/:id', Controllers.fetchCategoryByid);
router.use(authentication);
router.post('/devices', Controllers.postDevice);
router.post('/rent/:deviceId', Controllers.rent);
router.get('/transactions', Controllers.fetchTransactions);

// patch transactions/pay || MIDTRANS
router.patch('/transactions', Controllers.pay);

module.exports = router;
