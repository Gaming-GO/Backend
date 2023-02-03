const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin');

router.post('/register', adminControllers.register);
router.post('/login', adminControllers.login);

module.exports = router;
