import React from 'react'
import {useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { io } from 'socket.io-client';


export default function Room() {

    const params = useParams();
    const  socket  = io();

    useEffect(() => {
        socket.emit("join-room",{roomId: params.roomId});
        console.log(params);
        
    }, [params]);

  return (
    <div>Room</div>
  )
}
