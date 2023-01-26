import MessageController from "./controllers/MessageController.js";
import RoomController from "./controllers/RoomController.js";
import TypingController from "./controllers/TypingController.js";

const sockets = (socket) => {

    const typingController = new TypingController(socket);
    const roomController = new RoomController(socket);
    const messageController = new MessageController(socket);

    //Messages
    socket.on('send-message', messageController.sendMessage);
    socket.on('disconnect', messageController.disconnect);

    //Typing message
    socket.on("start-typing", typingController.startTyping);
    socket.on("stop-typing", typingController.stopTyping);

    //Rooms
    socket.on('join-room', roomController.joinRoom);
    socket.on('new-room-created', roomController.newRoomCreated);
    socket.on('room-removed', roomController.roomRemoved);

}

export default sockets;