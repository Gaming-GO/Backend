const express = require('express');
const router = express.Router();
const customerRouter = require('./customer');
const adminRouter = require('./admin');
const messageRouter = require('./message')

router.use('/admin', adminRouter);
router.use('/pub', customerRouter);
router.use(messageRouter)

module.exports = router;
