import { Container, Box } from '@mui/material';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookies';

function App() {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setSocket(io('http://localhost:4000'));
    const _userId = Cookies.getItem("userId");
    if (_userId) {
      setUserId(_userId);
    }
  }, []);

  return (
    <div>
      <Container>
        <Header socket={socket} userId={userId} setUserId={setUserId}/>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Outlet context={{ socket, userId }} />
        </Box>
      </Container>
    </div>
  );
}

export default App;
