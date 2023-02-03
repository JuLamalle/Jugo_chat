import BaseController from "./BaseController.js";
import Room from "../../models/Rooms.js";

export default class RoomController extends BaseController {
    joinRoom = ({ roomId }) => {
        console.log("Joining room")
        this.socket.join(roomId);
        console.log(roomId);
        this.socket.broadcast.emit("message-from-server",  {message :"User joined"});

    }

    newRoomCreated = ({ roomId, userId, roomName }) => {
        const room = new Room({
            name: roomName,
            roomId: roomId,
            userId: userId,
        });
        room.save();
        this.socket.emit("new-room-created", {room});
    }

    roomRemoved = async ({roomId}) => {
        await Room.deleteOne({roomId});
        this.socket.emit("room-removed", { roomId });

    }

    renameRoom = async ({renameRoomId, newRoomName}) => {
        await Room.findOneAndUpdate({roomId: renameRoomId}, {name: newRoomName});
        this.socket.emit("rename-room", {renameRoomId}, {newRoomName});
    }
}