import React from 'react';
import { Button, Card, Box } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";


export default function Header() {
    const navigate = useNavigate();
    const createNewRoom = () => {
        const roomId = uuidv4();
        navigate(`/room/${roomId}`);
    }
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
                    {/* <Link style={{ textDecoration: "none" }} to={`/room/${roomId}`}>
                        <Button sx={{ color: "white" }} variant="text">
                            Room 1
                        </Button>
                    </Link> */}
                </Box>
                <Button sx={{ color: "white" }} variant="text" onClick={createNewRoom}>
                    New Room
                </Button>
            </Box>
        </Card>
    );
}
