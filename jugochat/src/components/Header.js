import { React, useState, useEffect } from 'react';
import { Button, Card, Box } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";


export default function Header({ socket }) {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const createNewRoom = () => {
        const roomId = uuidv4();
        navigate(`/room/${roomId}`);
        setRooms([...rooms, roomId]);
        socket.emit("new-room-created", { roomId });
    }

    useEffect(() => {
        async function fetchRooms() {
            await fetch('http://localhost:4000/rooms')
                .then(res => res.json())
                // .then((res) => { console.log(res) })
                .then( res => {setRooms(res.rooms)} );
        }
        fetchRooms();
    }, [rooms])


    useEffect(() => {
        if (!socket) return;
        socket.on("new-room-created", ({ room }) => {
            setRooms([...rooms, room]);
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
                            return (
                                <Link
                                    key={room._id}
                                    style={{ textDecoration: "none" }}
                                    to={`/room/${room.roomId}`}
                                >
                                    <Button sx={{ color: "white" }} variant="text">
                                        {room.name}
                                    </Button>
                                </Link>
                            )
                        })}
                </Box>
                <Button sx={{ color: "white" }} variant="text" onClick={createNewRoom}>
                    New Room
                </Button>
            </Box>
        </Card>
    );
}
