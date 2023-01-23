import BaseController from "./BaseController.js";

export default class RoomController extends BaseController {
    joinRoom = ({ roomId }) => {
        console.log("Joining room")
        this.socket.join(roomId);
    }
}