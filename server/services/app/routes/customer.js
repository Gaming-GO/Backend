const express = require('express');
const Controllers = require('../controllers/index');
const authentication = require('../middlewares/authentication');
const router = express.Router();

router.post('/register', Controllers.custRegister);
router.post('/login', Controllers.custLogin);
router.get('/devices', Controllers.fetchDevices);
router.get('/users', Controllers.fetchAllUser);
router.get('/devices/:id', Controllers.fetchDeviceById);
router.get('/categories', Controllers.fetchCategories);
router.get('/categories/:id', Controllers.fetchCategoryByid);
router.use(authentication);
router.post('/devices', Controllers.postDevice);
router.post('/rent/:deviceId', Controllers.rent);
router.get('/user/:userId', Controllers.fetchUserById);
router.get('/transactions', Controllers.fetchTransactions);

// GET transactions/pay || MIDTRANS
router.get('/payment', Controllers.pay);
// PUT checkout
router.put('/checkout', Controllers.checkout);

// GET nearest products
router.get('/nearest', Controllers.nearest);

// GET history
router.get('/histories', Controllers.histories);

module.exports = router;