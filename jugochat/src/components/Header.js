import { React, useState, useEffect } from "react";
import { Button, Card, Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookies";

export default function Header({ socket, userId, setUserId }) {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleClose = () => {
    setOpen(false);
    console.log(name);
  };
  const handleOpen = () => setOpen(true);

  const createNewRoom = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
    setRooms([...rooms, { roomId, name: "RoomT", _id: "testId" }]);
    socket.emit("new-room-created", { roomId, userId });
  };
  const login = () => {
    const userId = uuidv4();
    setUserId(userId);
    Cookies.setItem("userId", userId);
    navigate("/");
  };
  const logout = () => {
    setUserId(null);
    Cookies.removeItem("userId");
    navigate("/");
  };

  useEffect(() => {
    async function fetchRooms() {
      await fetch("http://localhost:4000/rooms")
        .then((res) => res.json())
        .then((res) => {
          setRooms(res.rooms);
        });
    }
    fetchRooms();
  }, [rooms]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new-room-created", ({ room }) => {
      setRooms([...rooms, room]);
    });

    socket.on("room-removed", ({ roomId }) => {
      setRooms(rooms.filter((room) => room.roomId !== roomId));
    });
  }, [socket]);

  return (
    <Card sx={{ margin: 5, backgroundColor: "gray" }} raised>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Link style={{ textDecoration: "none" }} to="/">
            <Button sx={{ color: "white" }} variant="text">
              Home
            </Button>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/chats">
            <Button sx={{ color: "white" }} variant="text">
              General
            </Button>
          </Link>
          {rooms.map((room) => {
            return (
              <Link
                key={room._id}
                style={{ textDecoration: "none" }}
                to={`/room/${room.roomId}`}
              >
                <Button sx={{ color: "white" }} variant="text">
                  {room.name}
                </Button>
              </Link>
            );
          })}
        </Box>
        <Box>
          {!userId && (
            <div>
              <Button
                sx={{ color: "white" }}
                variant="text"
                onClick={() => {
                  login();
                  handleOpen();
                }}
              >
                Login
              </Button>
            </div>
          )}

          {userId && (
            <>
              <Button
                sx={{ color: "white" }}
                variant="text"
                onClick={createNewRoom}
              >
                New Room
              </Button>
              <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={{
                    width: "400px",
                    margin: "50%",
                    border: "2px solid",
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    marginTop: "400px",
                    height: "120px",
                    borderRadius: "10px",
                  }}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Please enter your Nickname :
                  </Typography>
                  <TextField
                    sx={{ marginTop: "10px" }}
                    id="outlined-basic"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    label="Carlos"
                    variant="outlined"
                  >
                    {" "}
                    {name}
                  </TextField>
                  <Button
                    onClick={handleClose}
                    variant="secondary"
                    sx={{ marginTop: "20px" }}
                  >
                    Confirm
                  </Button>
                </Box>
              </Modal>

              <Button sx={{ color: "white" }} variant="text" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
}
