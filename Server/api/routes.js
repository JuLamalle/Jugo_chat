import { Router } from "express";
import Room from "../models/Rooms.js";
import Message from "../models/Messages.js"

const router = new Router();

router.get("/rooms", async (req, res) => {
    const rooms = await Room.find();
    res.json({rooms});
});

router.get("/room-messages/:roomId", async (req, res) => {
    const roomMessages = await Message.find({roomId: req.params.roomId});
    res.json({roomMessages});
});

export default router;