import express from "express";
import http from 'http';
import {Server} from 'socket.io';
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 4000;
const httpServer = http.createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin:["http://localhost:3000"],
    },
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
   
    socket.on('send-message',({message, roomId})=>{
        let skt = socket.broadcast
        skt = roomId ? skt.to(roomId) : skt;
        skt.emit("message-from-server",{message});
    });

    socket.on("start-typing",({roomId})=>{
        let skt = socket.broadcast
        skt = roomId ? skt.to(roomId) : skt;
       skt.emit("start-typing-from-server");
    });

    socket.on("stop-typing",({roomId})=>{
        let skt = socket.broadcast
        skt = roomId ? skt.to(roomId) : skt;

        skt.emit('stop-typing-from-server');

    });

    socket.on('join-room',({roomId})=>{
        console.log("Joining room")
        socket.join(roomId);
    });

  

    socket.on('disconnect', (socket) => {
        console.log("User left");
    });
});


    

httpServer.listen( PORT, () => {
    console.log('Server is running on http://localhost:4000')
}); 