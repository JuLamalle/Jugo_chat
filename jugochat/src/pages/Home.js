import { Typography } from '@mui/material';
import { useOutletContext } from 'react-router-dom';


function Home() {
  const {socket} = useOutletContext();
  console.log(socket);
  return (
    <Typography>Welcome to IRC Bolo !</Typography>
    )
}

export default Home;