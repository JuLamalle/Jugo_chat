import React from 'react';
import { Button, Card } from '@mui/material';
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";


export default function Header() {
    const roomId = uuidv4();
  return (
    <Card sx={{ margin:5, backgroundColor: "gray"}} raised>
        <Link to="/">
            <Button sx={{ color: "white", textDecoration: "none"}} variant="text">Home</Button>
        </Link>
        <Link to="/chats">
            <Button sx={{ color: "white", textDecoration: "none"}} variant="text">Chats</Button>
        </Link>
        <Link to={`/room/${roomId}`}>
            <Button sx={{ color: "white", textDecoration: "none"}} variant="text">
                Room 1
            </Button>
        </Link>
    </Card>
  );
}
