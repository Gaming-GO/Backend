const express = require('express')
const cors = require('cors');
const { createServer } = require("http");
const router = require('./routes/message');
const mainRouter = require()
const {connIOServer} = require('./midlewares/socketio');
const app = express()
const port = process.env.PORT || 4000
const {Server} = require("socket.io");

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors())

app.use(router);

const httpServer = createServer(app);

connIOServer(httpServer);

// module.exports = app;

httpServer.listen(port, () => console.log("rnning"));