const { Server } = require("socket.io");
const { io: Client } = require("socket.io-client");

// Create Server 2 on port 3002
const server2 = new Server(3002, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect Server 2 to Server 1 (Relay messages)
const server1Socket = Client("http://localhost:3001");

server2.on("connection", (socket) => {
  console.log("User 2 connected to Server 2");

  // Receive and relay messages
  socket.on("sendMessage", (data) => {
    console.log(`Server 2 received: ${data.username}: ${data.message}`);
    // Broadcast to clients connected to Server 2
    socket.broadcast.emit("receiveMessage", data);

    // Relay the message to Server 1
    server1Socket.emit("relayMessage", data);
  });
});

// Handle messages relayed from Server 1
server1Socket.on("receiveRelayMessage", (data) => {
  server2.emit("receiveMessage", data);
});
