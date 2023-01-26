import { React, useState, useEffect } from 'react';
import { Button, Card, Box } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Cookies from 'js-cookies';


export default function Header({ socket, userId, setUserId }) {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);

    const createNewRoom = () => {
        const roomId = uuidv4();
        navigate(`/room/${roomId}`);
        setRooms([...rooms, {roomId, name: "RoomT", _id: "testId"}]);
        socket.emit("new-room-created", { roomId, userId });
    };
    const login = () => {
        const userId = uuidv4();
        setUserId(userId);
        Cookies.setItem("userId", userId);
        navigate("/");

    };
    const logout = () => {
        setUserId(null);
        Cookies.removeItem("userId");
        navigate("/");

    };

    useEffect(() => {
        async function fetchRooms() {
       const res = await fetch("http://localhost:4000/rooms");
      const { rooms } = await res.json();
      setRooms(rooms);
        }
        fetchRooms();
    }, []);


    useEffect(() => {
        if (!socket) return;
        socket.on("new-room-created", ({ room }) => {
            setRooms([...rooms, room]);
        });

        socket.on("room-removed", ({ roomId }) => {
            setRooms(rooms.filter(room => room.roomId !== roomId));
        });

    }, [socket]);

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
                <Box>
                    {!userId && (
                        <Button sx={{ color: "white" }} variant="text" onClick={login}>
                            Login
                        </Button>
                    )}
                    {userId && (
                        <>
                            <Button sx={{ color: "white" }} variant="text" onClick={createNewRoom}>
                                New Room
                            </Button>

                            <Button sx={{ color: "white" }} variant="text" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </Card>
    );
}
