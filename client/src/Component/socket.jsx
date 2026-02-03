import { io } from "socket.io-client";

const socket = io("https://backdressingvote.gpower-et.com", {
  transports: ["websocket", "polling"],
});

export default socket;
