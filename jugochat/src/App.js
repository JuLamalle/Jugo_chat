import { Container, Box } from '@mui/material';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';


function App() {
  return (
    <div>
      <Container>
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Outlet />
        </Box>
      </Container>
    </div>
  );
}

export default App;
