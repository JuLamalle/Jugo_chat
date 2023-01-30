import React from 'react'
import { useEffect, useState } from 'react';
import { Box, Typography, OutlinedInput, InputAdornment, IconButton, InputLabel, Card, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useOutletContext, useParams } from 'react-router-dom';
import Cookies from 'js-cookies';



export default function Chat() {
  const { socket, userId } = useOutletContext();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const { roomId } = useParams();
  const [nickname, setNickname] = useState(null);


  useEffect(() => {
    const nickname = Cookies.getItem("nickname");
    if (nickname) {
      setNickname(nickname);
    }
    if (!socket) return;
    socket.on('message-from-server', (data) => {
      setChat((prev) => [...prev, { message: data.message, 'received': true }]);
    });

    socket.on('start-typing-from-server', () => setTyping(true));

    socket.on('stop-typing-from-server', () => setTyping(false));
  }, [socket]);

  function handleForm(e) {
    e.preventDefault();
    socket.emit("send-message", { message, roomId, userId, nickname })
    setChat((prev) => [...prev, { message, 'received': false }]);
    setMessage("");

  }

  const [typingTimeout, settypingTimeout] = useState(null);

  function handleInput(e) {

    setMessage(e.target.value);
    socket.emit("start-typing", {roomId});

    if (typingTimeout) { clearTimeout(typingTimeout) }

    settypingTimeout(setTimeout(() => {
      socket.emit("stop-typing",{roomId});
    }, 1000));
  }

async function removeRoom() {

socket.emit("room-removed", {roomId});
window.location.href = "/";
}

  return (
        <Card sx={{ padding: 2, marginTop: 10, width: '60%', backgroundColor: "gray", color: "white" }}>
          <Box sx={{display:"flex", justifyContent:"space-between"}}>
          {
          roomId &&     <Typography>Room: {roomId}</Typography>}
          {roomId &&   (  <Button size='small' variant='text' color='secondary' onClick={removeRoom}>Remove Room</Button>
          )}
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            {chat.map((data) => (
              <Typography sx={{ textAlign: data.received ? "left" : "right" }} key={data.message}>{data.message}</Typography>
            ))}

          </Box>
          <Box component="form" onSubmit={handleForm}>
            {typing && (
              <InputLabel sx={{ color: "white" }} shrink htmlFor="message-input">
                is typing...
              </InputLabel>
            )}
            <OutlinedInput
              sx={{ backgroundColor: "white", width: "100%" }}
              placeholder="Write your message"
              value={message}
              id="message-input"
              onChange={handleInput}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    type='submit'
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
        </Card>
  )
}

