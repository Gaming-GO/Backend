const express = require('express');
const router = express.Router();
const customerRouter = require('./customer');
const adminRouter = require('./admin');

router.use('/admin', adminRouter);
router.use('/pub', customerRouter);

module.exports = router;
