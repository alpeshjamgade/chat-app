const http = require("http");
const config = require("config")
const path = require("path");
const express = require("express");
const socketio = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

const webPort = config.get("WEB_PORT");
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

let count = 0;
io.on("connection", (socket) => {
   console.log("[*] Client connected!")
   socket.emit("countUpdated", count);

   socket.on("increment", () => {
      count = count + 1;
      // socket.emit("countUpdated", count);
      io.emit("countUpdated", count);
   })
});

server.listen(webPort, () => {
   console.log(`[*] Server running on port http://localhost:${webPort}`)
});

module.exports = app;