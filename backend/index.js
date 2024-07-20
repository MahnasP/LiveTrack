import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors"

const app = express();
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

io.on("connection", (socket) => {
    console.log("a user connected: ", socket.id);
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
      }); 
})

app.get("/", (req, res) => {
    res.send("hello");
})

server.listen(port, () => {
    console.log("server running on port: ", port);
})

