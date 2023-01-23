import BaseController from "./BaseController.js";

export default class TypingController extends BaseController {

    startTyping = ({ roomId }) => {
        let skt = this.socket.broadcast
        skt = roomId ? skt.to(roomId) : skt;
        skt.emit("start-typing-from-server");
    };

    stopTyping = ({ roomId }) => {
        let skt = this.socket.broadcast
        skt = roomId ? skt.to(roomId) : skt;
        skt.emit('stop-typing-from-server');
    };

}
