const { Server } = require("socket.io");

// Create a Socket.IO server
const io = new Server(3001, {
  cors: {
    origin: "https://5a80-43-230-122-109.ngrok-free.app", // Allow requests from your Next.js app
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for messages from the client
  socket.on("sendMessage", (data) => {
    console.log(`${data.username}: ${data.message} ${socket.id}`);
    // Broadcast the message to all clients
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
