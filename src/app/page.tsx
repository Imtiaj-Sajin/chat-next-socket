"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Connect to the server
const socket = io("https://j7f0x0n5-3001.asse.devtunnels.ms/");

export default function Home() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);

  useEffect(() => {
    // Listen for messages from the server
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (username && message) {
      socket.emit("sendMessage", { username, message });
      setMessage(""); // Clear the input field after sending
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Simple Chat</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
          Send
        </button>
      </div>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}:</strong> {msg.message}{socket.id}
          </div>
        ))}
      </div>
    </div>
  );
}
