const { Server } = require("socket.io");

let io;

function connIOServer(server) {
    io = new Server(server)
    return io;
}

function getIO(){
    return io;
}

module.exports = {connIOServer,getIO};