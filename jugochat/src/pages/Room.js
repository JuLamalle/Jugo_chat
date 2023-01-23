import React from 'react'
import {useOutletContext, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import Chat from '../components/Chat';


export default function Room() {

    const params = useParams();
    const  {socket}  = useOutletContext();

    useEffect(() => {
        if (!socket) return;
        socket.emit("join-room",{roomId: params.roomId});
        console.log(params);
        
    }, [socket]);
 
  return (
    <Chat />
  )
}
