import React, { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputField from "../reuseables/InputField";
import SendIcon from "@mui/icons-material/Send";
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: "480px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

export default function ChatModal({ chatModal, onHide }) {
  const socket = useMemo(() => io("http://127.0.0.1:8080"), []);
  const chatBoxRef = useRef();
  const [room, setRoom] = useState("");
  const [roomsId, setRoomsId] = useState("");
  const [socketId, setSocketId] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [usersList, setUsersList] = useState(null);
  const userEmail = JSON.parse(localStorage.getItem("webUserEmail"));

  const handleRoomChange = (item) => {
    setRoom(item);
  };

  useEffect(() => {
    const scrollAutoHeight =
      chatBoxRef?.current?.scrollHeight - chatBoxRef?.current?.clientHeight;
    chatBoxRef.current?.scrollTo(0, scrollAutoHeight);
  }, [chatMessages?.length]);

  const handleSubmit = async () => {
    // if (room === "") return;
    // const messageData = {
    //   room: room,
    //   email: userEmail,
    //   message: message,
    //   recieverId:
    //     userEmail === "vats@yopmail.com"
    //       ? "657ad914b3cfaa13cb2fcfbc"
    //       : "657a894a48ccad46c68f3b90",
    //   timeStamp: new Date().toLocaleString(),
    // };
    socket.emit("message", message); //to chat with all
    socket.emit("message", { message, roomsId }); //to chat with all the persons

    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      //Used to connect to socket
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });
    // socket.on("welcome", (recievedData) => {
    //   console.log("connected", recievedData);
    // });
    socket.on("message", (recievedData) => {
      console.log("message=>", recievedData);
      setChatMessages((prev) => [...prev, recievedData]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const getAllTheUsers = async () => {
    try {
      const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}users`);
      if (resp?.status) {
        setUsersList(resp?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // useEffect(() => {
  //   getAllTheUsers();
  // }, []);

  // useEffect(() => {
  //   if (room) {
  //     socket.emit("new-user-add", room._id);
  //     socket.on("get-users", (users) => {
  //       console.log("users", users);
  //       //   setOnlineUsers(users);
  //     });

  //     socket.on("recieve-message", (data) => {
  //       console.log("recieve-message : ", data);
  //       // setReceivedMessage(data);
  //       setChatMessages((prev) => [...prev, data]);
  //     });
  //   }
  // }, [room]);

  const handleJoinRoom = () => {
    console.log("called");
    socket.emit("join-room", roomsId);
  };

  return (
    <div>
      <Modal
        open={chatModal}
        onClose={onHide}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" padding="10px 0">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Chat {socketId}
            </Typography>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={room}
                  renderValue={(selected) => {
                    if (selected === "") {
                      return "Select User";
                    } else return selected.firstName + " " + selected.lastName;
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {usersList?.map((item) => {
                    return (
                      <MenuItem
                        disabled={userEmail === item.email}
                        onClick={() => handleRoomChange(item)}
                      >
                        {item.firstName + " " + item.lastName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Divider />
          <Box
            padding="10px 0"
            display="flex"
            justifyContent="space-between"
            flexDirection="column"
          >
            <Box ref={chatBoxRef} overflow="auto" height="340px">
              {chatMessages?.map((item, index) => {
                return (
                  <Box key={item} marginBottom="10px">
                    <Typography
                      fontSize="14px"
                      // textAlign={userEmail === item ? "right" : "left"}
                      id="modal-modal-description"
                    >
                      {item}
                    </Typography>
                    <Typography
                      fontSize="11px"
                      // textAlign={userEmail === item ? "right" : "left"}
                    >
                      {item}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Box display="flex" alignItems="center" width="100%" gap="15px">
              <TextField
                sx={{ width: "100%" }}
                type="text"
                placeholder="Enter Room"
                value={roomsId}
                onChange={(e) => setRoomsId(e.target.value)}
              />
              <TextField
                sx={{ width: "100%" }}
                type="text"
                placeholder="Enter text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={() => handleJoinRoom("1234")}>Join Room</Button>
              <SendIcon sx={{ cursor: "pointer" }} onClick={handleSubmit} />
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
