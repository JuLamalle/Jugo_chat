import React from 'react'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

export default function Chat () {

const [socket, setSocket] = useState(null);
const [message, setMessage] = useState('');
const [chat, setChat] = useState([]);

useEffect(() => {
    setSocket(io('http://localhost:4000'));
  }, []);


  useEffect(() => {
    if (!socket) return;
    socket.on('message-from-server', (data) => {
      setChat((prev) => [...prev, data.message]);
    })

  }, [socket]);


  function handleForm(e) {
    e.preventDefault();
    socket.emit("send-message", { message })
    setMessage("");

  }

   
    return (
        <div>
             <Box sx={{ marginBottom: 5 }}>
          {chat.map((message) => (
            <Typography>{message}</Typography>
          ))}

        </Box>
            <Box component="form" onSubmit={handleForm}>


                <OutlinedInput
                    placeholder="Write your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
        </div>
    )
}
