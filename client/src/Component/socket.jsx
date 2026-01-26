import { io } from "socket.io-client";

const socket = io("http://192.168.101.181:3270", {
  transports: ["websocket", "polling"],
});

export default socket;
