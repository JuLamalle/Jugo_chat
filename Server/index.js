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
    console.log("Connection is ready");
})

httpServer.listen( PORT, () => {
    console.log('Server is running on http://localhost:4000')
}); 