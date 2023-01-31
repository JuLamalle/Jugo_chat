import React, { useRef } from 'react'
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
  const [nickname, setNickname] = useState("");
  const messageRef = useRef();

  useEffect(() => {
    const nickname = Cookies.getItem("nickname");
    if (nickname) {
      setNickname(nickname);
    }
    if (!socket) return;
    socket.on('message-from-server', (data) => {
      setChat((prev) => [...prev, { message: data.message, 'received': true, nickname: data.nickname, roomId: data.roomId }]);
    });

    socket.on('start-typing-from-server', () => setTyping(true));

    socket.on('stop-typing-from-server', () => setTyping(false));

    if (messageRef.current) {
      messageRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }
  }, [socket]);

  function handleForm(e) {
    e.preventDefault();
    socket.emit("send-message", { message, roomId, userId, nickname })
    setChat((prev) => [...prev, { message, 'received': false, nickname: nickname }]);
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
        <Card sx={{ padding: 2, marginTop: 10, width: '60%', backgroundColor: "gray", color: "white", height:"500px", overflow:"scroll" }}>
          <Box sx={{display:"flex", justifyContent:"space-between"}}>
          {
          roomId &&     <Typography>Room ID: {roomId}</Typography>}
          {roomId &&   (  <Button size='small' variant='contained' color='error' onClick={removeRoom} sx={{marginBottom:"5px"}}>Remove Room</Button>
          )}
          </Box>
          <Box sx={{ marginBottom: 5 }}>
            {chat.map((data) => (
              <div  ref={messageRef} key={data._id}>
              <Typography sx={{ textAlign: data.received ? "left" : "right", fontWeight:"bold", color:"yellow", fontSize:"1.1rem"}} >{data.nickname}</Typography>
              <Typography sx={{ textAlign: data.received ? "left" : "right", margin:"5px 10px 5px 5px" }}>{data.message}</Typography>
              </div>
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

