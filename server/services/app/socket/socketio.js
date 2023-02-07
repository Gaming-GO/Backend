const { Server } = require("socket.io");

let io;

function connIOServer(server) {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    })

    io.on("connection", (socket) => {
        console.log("connects!!!", socket.id)
        socket.on("join:room", (room) => {
            console.log("join room")
            // console.log("joining room ", socket.id);
            socket.join(room);
        })
        socket.on("chat:msg", (data) => {
            console.log(data)
            // console.log(data.msg, " inside room");
            // io.emit("resp:msg", data.msg)
            io.in(data.room).emit("resp:msg", data.msg);
        })
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