const express = require('express');
const Controllers = require('../controllers');
const router = express.Router();

router.post('/register', Controllers.custRegister);
router.post('/login', Controllers.custLogin);

module.exports = router;
