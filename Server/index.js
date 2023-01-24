import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import path from "path";
import { fileURLToPath } from "url";
import sockets from "./socket/sockets.js";
import mongoose, { mongo } from "mongoose";
import router from "./api/routes.js";
import cors from "cors";

mongoose.set('strictQuery', false);
await mongoose.connect(
    "mongodb+srv://carbo:azerty59@ircbolo.srwbr9b.mongodb.net/?retryWrites=true&w=majority"
);

const app = express();
const PORT = 4000;
const httpServer = http.createServer(app);
app.use(cors());
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

app.use(cors());

// // Exemple Express/Socketio page
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

app.use("/", router);

io.on('connection', sockets);

httpServer.listen(PORT, () => {
    console.log('Server is running on http://localhost:4000')
}); 