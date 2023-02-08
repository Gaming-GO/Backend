const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/admin');
const authentication = require('../middlewares/authentication');

router.post('/register', adminControllers.register);
router.post('/login', adminControllers.login);
router.use(authentication);
router.get('/users', adminControllers.fetchUsers);
router.get('/users/:id', adminControllers.fetchUserById);
router.patch('/users/:id', adminControllers.updateUser);

module.exports = router;
