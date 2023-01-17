import React from 'react'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import InputLabel from '@mui/material/InputLabel';
import { Card } from '@mui/material';

export default function Chat() {

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);


  useEffect(() => {
    setSocket(io('http://localhost:4000'));
  }, []);


  useEffect(() => {
    if (!socket) return;
    socket.on('message-from-server', (data) => {
      setChat((prev) => [...prev, { message: data.message, 'received': true }]);
    });



    socket.on('start-typing-from-server', () => setTyping(true));


    socket.on('stop-typing-from-server', () => setTyping(false));
  }, [socket]);




  function handleForm(e) {
    e.preventDefault();
    socket.emit("send-message", { message })
    setChat((prev) => [...prev, { message, 'received': false }]);
    setMessage("");

  }

  const [typingTimeout, settypingTimeout] = useState(null);

  function handleInput(e) {

    setMessage(e.target.value);
    socket.emit('start-typing');

    if (typingTimeout) { clearTimeout(typingTimeout) }

    settypingTimeout(setTimeout(() => {
      socket.emit('stop-typing');
    }, 1000));
  }


  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Card sx={{ padding: 2, marginTop: 10, width: '60%', backgroundColor: "gray", color: "white" }}>
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
      </Box>
    </div>
  )
}

