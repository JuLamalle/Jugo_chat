import { Typography } from '@mui/material';
import { useOutletContext } from 'react-router-dom';


function Home() {
  const {socket} = useOutletContext();
  return (
<>
<Typography>Welcome to IRC Bolo !</Typography>
<Typography> Login if you want to create a room</Typography>
</>    )
}

export default Home;