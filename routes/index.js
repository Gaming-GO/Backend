const express = require('express')
const { getIO } = require('../midlewares/socketio')
const router = express.Router()

router.get("/", (req,res) => {
    const io = getIO();
    io.on("connection", (socket) => {
        console.log("connectres");
    })
    res.render("sandbox")
})

module.exports = router