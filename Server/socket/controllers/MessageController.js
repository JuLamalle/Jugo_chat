import BaseController from "./BaseController.js";
import Message from "../../models/Messages.js";

export default class MessageController extends BaseController {
    messageCount = 1;
    disconnect = (socket) => {
        console.log("User left");
    }

    sendMessage = async ({ message, roomId, userId }) => {
        const countMessage = await Message.estimatedDocumentCount();
        const newMessage = new Message({
            messageId: countMessage+1,
            message: message,
            roomId: roomId,
            userId: userId,
        });
        newMessage.save();
        let skt = this.socket.broadcast
        skt = roomId ? skt.to(roomId) : skt;
        skt.emit("message-from-server", { message });
    }
}