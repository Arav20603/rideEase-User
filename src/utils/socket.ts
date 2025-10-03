import { io } from "socket.io-client";

export const socket = io("http://192.168.31.248:4000", {  transports: ["websocket"] });