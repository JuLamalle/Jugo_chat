import BaseController from "./BaseController.js";
import Message from "../../models/Messages.js";

export default class MessageController extends BaseController {
    disconnect = (socket) => {
        console.log("User left");
    }

    sendMessage = ({ message, roomId, messageId, userId }) => {
        const room = new Room({
            messageId: 'RoomT',
            message: 'RoomT',
            roomId: roomId,
            userId: userId,
        });
        let skt = this.socket.broadcast
        skt = roomId ? skt.to(roomId) : skt;
        skt.emit("message-from-server", { message });
    }
}