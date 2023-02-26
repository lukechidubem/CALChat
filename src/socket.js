import io from "socket.io-client";

const socket = io.connect("http://localhost:5000", {
  query: `user_id=${window.localStorage.getItem("user_id") || 0}`,
}); // Add this -- our server will run on port 5000, so we connect to it from here

export default socket;
