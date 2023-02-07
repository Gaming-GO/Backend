const express = require('express')
// const { getIO } = require('../midlewares/socketio')
const router = express.Router()
// const {Chat}= require("../models").models;
const Controller = require("../controllers/message")

router.post("/message", Controller.postMessage);
router.get("/message/:fromId", Controller.getAllUserRelatedToSender)
router.get('/message/:from/:to', Controller.getMessageHistory);


module.exports = router