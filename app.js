const express = require('express')
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
const router = require('./routes');
const {connIOServer} = require('./midlewares/socketio');
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors())
app.set("view engine", "ejs");

app.use(router);

const httpServer = createServer(app);
const io = connIOServer(httpServer);
// const io = new Server(httpServer);

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   // socket.on("test", (msg) => {
//   //   console.log(msg)
//   // })
// });

httpServer.listen(3000, () => console.log("rnning"));