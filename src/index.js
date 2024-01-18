const http = require("http");
const config = require("config")
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");


const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

const webPort = config.get("WEB_PORT");
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
   console.log("[*] Client connected!")
   socket.emit("greet", "Welcome!");
   socket.broadcast.emit("server-message", "A user has joined!")

   socket.on("client-message", (message, callback) => {
      const filter = new Filter();

      if (filter.isProfane(message)) {
         return callback('Profanity is not allowed!');
      }
      io.emit("server-message", message);
      return callback('delivered');
   })

   socket.on("disconnect", () => {
      io.emit("server-message", "A user has left!")
   })

   socket.on("client-location", (coords, callback) => {
      io.emit("server-message", `Location: https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
      callback("Location is shared with users.");
   })
});

server.listen(webPort, () => {
   console.log(`[*] Server running on port http://localhost:${webPort}`);
});

module.exports = app;