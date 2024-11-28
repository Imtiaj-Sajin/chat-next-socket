const { Server } = require("socket.io");
const { io: Client } = require("socket.io-client");

// Create Server 1 on port 3001
const server1 = new Server(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect Server 1 to Server 2 (Relay messages)
const server2Socket = Client("http://localhost:3002");

server1.on("connection", (socket) => {
  console.log("User 1 connected to Server 1");

  // Receive and relay messages
  socket.on("sendMessage", (data) => {
    console.log(`Server 1 received: ${data.username}: ${data.message}`);
    // Broadcast to clients connected to Server 1
    socket.broadcast.emit("receiveMessage", data);

    // Relay the message to Server 2
    server2Socket.emit("relayMessage", data);
  });
});

// Handle messages relayed from Server 2
server2Socket.on("receiveRelayMessage", (data) => {
  server1.emit("receiveMessage", data);
});
