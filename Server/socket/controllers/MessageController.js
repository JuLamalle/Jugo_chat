import BaseController from "./BaseController.js";

export default class MessageController extends BaseController {
    disconnect = (socket) => {
        console.log("User left");
    }

    sendMessage = ({ message, roomId }) => {
        let skt = this.socket.broadcast
        skt = roomId ? skt.to(roomId) : skt;
        skt.emit("message-from-server", { message });
    }
}