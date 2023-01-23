import { React, useState, useEffect } from 'react';
import { Button, Card, Box } from '@mui/material';
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";


export default function Header() {
    const navigate = useNavigate();
    const { socket } = useOutletContext();
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState("noname");
    const createNewRoom = () => {
        const roomId = uuidv4();
        navigate(`/room/${roomId}`);
        socket.emit("new-room-created", { roomId });
    }

    useEffect(() => {
        if (!socket) return;
        socket.on("new-room-created", ({ roomId }) => {
            setRooms([...rooms, { "id": roomId, "name": name }]);
        })
    }, [socket])

    return (
        <Card sx={{ margin: 5, backgroundColor: "gray" }} raised>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Link style={{ textDecoration: "none" }} to="/">
                        <Button sx={{ color: "white" }} variant="text">Home</Button>
                    </Link>
                    <Link style={{ textDecoration: "none" }} to="/chats">
                        <Button sx={{ color: "white" }} variant="text">General</Button>
                    </Link>
                    {
                        rooms.map((room) => {
                            <Link style={{ textDecoration: "none" }} to={`/room/${room}`}>
                                <Button sx={{ color: "white" }} variant="text">
                                    {room}
                                </Button>
                            </Link>
                        })}
                </Box>
                <Button sx={{ color: "white" }} variant="text" onClick={createNewRoom}>
                    New Room
                </Button>
            </Box>
        </Card>
    );
}
