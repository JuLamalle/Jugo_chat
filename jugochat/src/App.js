import { Container, Box } from '@mui/material';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io('http://localhost:4000'));
  }, []);

  return (
    <div>
      <Container>
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Outlet context={{socket}}/>
        </Box>
      </Container>
    </div>
  );
}

export default App;
