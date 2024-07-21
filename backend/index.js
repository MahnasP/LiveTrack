import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
  });

export const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,//"http://localhost:5173"
    methods: ["GET", "POST"],
}))

const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_ORIGIN,
        methods: ["GET", "POST"],
    }
})

let socketPosMap = {};//{socket.id: position: pos-array}//convert this to Map

io.on("connection", (socket) => {
    console.log("a user connected: ", socket.id);
    socket.on("send-location", (pos) => {
        socketPosMap[socket.id] = pos;
        io.emit("get-locations", socketPosMap);
    })
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete socketPosMap[socket.id];
        io.emit("get-locations", socketPosMap);
      }); 
})

app.get("/", (req, res) => {
    res.send("hello");
})

server.listen(port, () => {
    console.log("server running on port: ", port);
})

