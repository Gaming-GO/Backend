const { Server } = require("socket.io");

let io;

const users = {};

function connIOServer(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000"
        }
    })

    io.on("connection", (socket) => {
        socket.on("join:room", (room) => {
            // console.log("joining room ", socket.id);
            socket.join(room);
        })
        socket.on("chat:msg", (data) => {
            // console.log(data.msg, " inside room");
            // io.emit("resp:msg", data.msg)
            io.in(data.room).emit("resp:msg", data.msg);
        })
        console.log("connects!!!")
        // socket.on("chat message", (data) => {
        //     io.to(users[data.room]).emit("resp", data);
        // })
        socket.on("disconnect", () => {
            console.log("disconnect");
        })
    })
}

function getIO(){
    return io;
}

module.exports = {connIOServer,getIO};