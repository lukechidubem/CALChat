import io from "socket.io-client";

let socket;

// https://calchat-api.onrender.com

const connectSocket = (user_id) => {
  // socket = io.connect("http://localhost:5000", {
  socket = io.connect("https://calchat-api.onrender.com", {
    query: `user_id=${user_id}`,
    // query: `user_id=${window.localStorage.getItem("user_id")}`,
  }); // Add this -- our server will run on port 5000, so we connect to it from here
};

export { socket, connectSocket };
