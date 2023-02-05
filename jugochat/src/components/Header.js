import { React, useState, useEffect } from "react";
import { Button, Card, Box, IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookies";
import EditIcon from "@mui/icons-material/Edit";

export default function Header({ socket, userId, setUserId }) {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [openOldUser, setOpenOldUser] = useState(false);
  const [renameRoomId, setRenameRoomId] = useState("");
  const [openRoomModal, setOpenRoomModal] = useState(false);
  const [openNewRoomNameModal, setOpenNewRoomNameModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [nickname, setNickname] = useState("");
  const [oldNickname, setOldNickname] = useState("");
  const [newNickName, setNewNickName] = useState("");
  const [openNewNicknameModal, setOpenNewNicknameModal] = useState(false);

  // Modal rename room
  const handleOpenRenameRoom = () => setOpenNewRoomNameModal(true);
  const handleCloseRenameRoom = () => setOpenNewRoomNameModal(false);

  const renameRoom = (renameRoomId) => {
    setRenameRoomId(renameRoomId);

    handleOpenRenameRoom();
  };

  const confirmRenameRoom = () => {
    socket.emit("rename-room", { renameRoomId, newRoomName });
    handleCloseRenameRoom();
    setNewRoomName("");
  };


  // Modal rename Nickname
  const handleOpenRenameNickname = () => setOpenNewNicknameModal(true);
  const handleCloseRenameNickname = () => setOpenNewNicknameModal(false);

  const renameNickname = () => {
    handleOpenRenameNickname();
  }

  const confirmRenameNickname = () => {
    Cookies.setItem("nickname", newNickName);
    Cookies.setItem("userId", userId);
    socket.emit("rename-nickname", { userId, newNickName });
    handleCloseRenameNickname();
  };


  //Modal login
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    Cookies.setItem("nickname", nickname);
    login();
  };

  //Modal login old user
  const handleOpenOldUser = () => setOpenOldUser(true);
  const handleCloseOldUser = () => {
    setOpenOldUser(false);
    loginOldUser();
    if (userId != null) {
      Cookies.setItem("nickname", oldNickname);
      setNickname(oldNickname);
    }
  };

  const handleCancelLogin = () => {
    setOpen(false);
    setOpenOldUser(false);
    setOldNickname(null);
  };

  //Generate a userId
  const createNewRoom = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
    setRooms([...rooms, { roomId: roomId, name: roomName/*, _id: "testId"*/ }]);
    socket.emit("new-room-created", { roomId, userId, roomName });
    handleCloseRoomModal();
  };

  const login = () => {
    const userId = uuidv4();
    setUserId(userId);
    Cookies.setItem("userId", userId);
    navigate("/");
  };

  const loginOldUser = async () => {
    await fetch(`http://localhost:4000/userid-by-nickname/${oldNickname}`)
      .then((res) => res.json())
      .then(res => {
        console.log(res.data.userId);
        setUserId(res.data.userId);
        Cookies.setItem("userId", res.data.userId);
      })
      .then(navigate("/"))
      .catch(err => {
        alert('No Nickname matched ! Please, try again. ');
        setUserId(null);
        setOldNickname(null);
      })
  };

  const logout = () => {
    setUserId(null);
    setNickname(null);
    setOldNickname(null);
    Cookies.removeItem("userId");
    Cookies.removeItem("nickname");
    navigate("/");
  };

  const reload = () => {
    reload();
  }

  // Modal création room
  const handleOpenRoomModal = () => setOpenRoomModal(true);
  const handleCloseRoomModal = () => setOpenRoomModal(false);

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

    socket.on("rename-nickname", ({ userId, newNickName }) => {
      setUserId(userId);
      setNickname(newNickName);
    });

    socket.on("rename-room", ({ renameRoomId, newRoomName }) => {
      setRenameRoomId(renameRoomId);
      setNewRoomName(newRoomName);
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

          {userId && (
            <>
              <Link style={{ textDecoration: "none" }} to="/chats">
                {/* <Button sx={{ color: "white" }} variant="text">
                  General
                </Button> */}
              </Link>
              {rooms.map((room) => {
                return (
                  <Link
                    key={room._id}
                    style={{ textDecoration: "none" }}
                    to={`/room/${room.roomId}`}
                    onClick={reload}
                  >
                    <Button sx={{ color: "white" }} variant="text">
                      {room.name}
                    </Button>
                    <IconButton
                      onClick={() => renameRoom(room.roomId)}
                      edge="end"
                      type="submit"
                    >
                      <EditIcon />
                    </IconButton>
                  </Link>
                );
              })}
            </>
          )}
        </Box>

        <Box>
          {!userId && (
            <div>
              <Button
                sx={{ color: "white" }}
                variant="text"
                onClick={() => {
                  handleOpenOldUser();
                }}
              >
                Login
              </Button>
              <Button
                sx={{ color: "white" }}
                variant="text"
                onClick={() => {
                  handleOpen();
                }}
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Modal rename room  */}

          {userId && (
            <>
              <Modal
                open={openRoomModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-modal-descrip"
              >
                <Box
                  sx={{
                    width: "500px",
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
                  <Typography id="modal-title" variant="h6" component="h2">
                    Enter name room :
                  </Typography>
                  <TextField
                    sx={{ marginTop: "10px" }}
                    id="outlined-bas"
                    onChange={(e) => setRoomName(e.target.value)}
                    value={roomName}
                    label="Room Name"
                    variant="outlined"
                  ></TextField>

                  <Button
                    onClick={createNewRoom}
                    variant="secondary"
                    sx={{ marginTop: "20px" }}
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={handleCloseRoomModal}
                    variant="secondary"
                    sx={{ marginTop: "20px" }}
                  >
                    Cancel
                  </Button>

                </Box>
              </Modal>

              {/* Modal rename Nickname  */}

              <Modal
                open={openNewNicknameModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-modal-descrip"
              >
                <Box
                  sx={{
                    width: "500px",
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
                  <Typography id="modal-title" variant="h6" component="h2">
                    Please enter new Nickname :
                  </Typography>
                  <TextField
                    sx={{ marginTop: "10px" }}
                    id="outlined-bas"
                    onChange={(e) => setNewNickName(e.target.value)}
                    value={newNickName}
                    label="Nickname"
                    variant="outlined"
                  ></TextField>

                  <Button
                    onClick={confirmRenameNickname}
                    variant="secondary"
                    sx={{ marginTop: "20px" }}
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={handleCloseRenameNickname}
                    variant="secondary"
                    sx={{ marginTop: "20px" }}
                  >
                    Cancel
                  </Button>

                </Box>
              </Modal>



              <Button
                sx={{ color: "white" }}
                variant="text"
                onClick={handleOpenRoomModal}
              >
                New Room
              </Button>
              <Button sx={{ color: "white" }} variant="text" onClick={renameNickname}>{nickname}</Button>
              <Button sx={{ color: "white" }} variant="text" onClick={logout}>
                Logout
              </Button>

              {/* Modal New Room */}
              <Modal
                open={openNewRoomNameModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-modal-descrip"
              >
                <Box
                  sx={{
                    width: "500px",
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
                  <Typography id="modal-title-room" variant="h6" component="h2">
                    Enter new room name:
                  </Typography>
                  <TextField
                    sx={{ marginTop: "10px" }}
                    id="outlined-bas-room"
                    onChange={(e) => setNewRoomName(e.target.value)}
                    value={newRoomName}
                    label="New Room Name"
                    variant="outlined"
                  ></TextField>

                  <Button
                    onClick={confirmRenameRoom}
                    variant="secondary"
                    sx={{ marginTop: "20px" }}
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={handleCloseRenameRoom}
                    variant="secondary"
                    sx={{ marginTop: "20px" }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Modal>
            </>
          )}

          {/* Modal Nickname  */}

          <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                width: "500px",
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
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Please enter your Nickname :
              </Typography>
              <TextField
                sx={{ marginTop: "10px" }}
                id="outlined-basic"
                onChange={(e) => setNickname(e.target.value)}
                value={nickname}
                label="Name"
                variant="outlined"
              ></TextField>
              <Button
                onClick={handleClose}
                variant="secondary"
                sx={{ marginTop: "20px" }}
              >
                Confirm
              </Button>
              <Button
                onClick={handleCancelLogin}
                variant="secondary"
                sx={{ marginTop: "20px" }}
              >
                Cancel
              </Button>
            </Box>
          </Modal>

          {/* Modal Old User  */}

          <Modal
            open={openOldUser}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                width: "500px",
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
              <Typography id="modal-old-user-title" variant="h6" component="h2">
                Please enter your old Nickname :
              </Typography>
              <TextField
                sx={{ marginTop: "10px" }}
                id="outlined-old-user-textfield"
                onChange={(e) => setOldNickname(e.target.value)}
                value={oldNickname}
                label="Old Name"
                variant="outlined"
              ></TextField>
              <Button
                onClick={handleCloseOldUser}
                variant="secondary"
                sx={{ marginTop: "20px" }}
              >
                Confirm
              </Button>
              <Button
                onClick={handleCancelLogin}
                variant="secondary"
                sx={{ marginTop: "20px" }}
              >
                Cancel
              </Button>
            </Box>
          </Modal>

        </Box>
      </Box>
    </Card>
  );
}
