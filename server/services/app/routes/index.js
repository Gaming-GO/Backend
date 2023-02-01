const express = require('express');
const router = express.Router();
const Controllers = require('../controllers');

router.get('/', (req, res) => {
  res.send('Hello World! from routes');
});

module.exports = router;
