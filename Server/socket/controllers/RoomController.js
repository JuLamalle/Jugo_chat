import BaseController from "./BaseController.js";
import Room from "../../models/Rooms.js";

export default class RoomController extends BaseController {
    joinRoom = ({ roomId }) => {
        console.log("Joining room")
        this.socket.join(roomId);
    }

    newRoomCreated = ({ roomId, userId }) => {
        const room = new Room({
            name: 'RoomT',
            roomId,
            userId,
        });
        room.save();
        this.socket.broadcast.emit("new-room-created", { room });
    }
}