// import React from 'react'

// const Chat = () => {
//   return (
//     <div>

//     </div>
//   )
// }

// export default Chat
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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";
import AddRoomModal from "./AddRoomModal";

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
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [addRoomModal, setAddRoomModal] = useState(false);
  const userEmail = JSON.parse(localStorage.getItem("webUserEmail"));

  const handleRoomChange = (value) => {
    setRoom(value);
    socket.emit("join_room", value); //used to send room id server on backend
  };

  //   useEffect(() => {
  //     const scrollAutoHeight =
  //       chatBoxRef?.current?.scrollHeight - chatBoxRef?.current?.clientHeight;
  //     chatBoxRef.current?.scrollTo(0, scrollAutoHeight);
  //   }, [chatMessages?.length]);

  console.log("room", room?.roomName);
  const handleSubmit = async () => {
    if (!room || !room?.roomName) return;

    //DATE
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const curentDateFormat = `${day}-${month}-${year}`;

    //TIME
    const currentDateTime = new Date();
    const hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();
    const seconds = currentDateTime.getSeconds();
    const curentTimeFormat = `${hours}:${minutes}:${seconds}`;

    //USER
    const userInfo = usersList?.filter((it) => it.email === userEmail);

    const payload = {
      roomName: room?.roomName,
      message: message,
      user: userInfo[0],
      date: curentDateFormat,
      time: curentTimeFormat,
    };
    //emit is used to send data to the socket
    socket.emit("message", payload); //used to send message to server with message as key
    setMessage("");
  };

  const getAllTheRooms = async () => {
    try {
      const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}room`);
      if (resp?.status) {
        setRoomsList(resp?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getAllTheRooms();
  }, [addRoomModal]);

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

  useEffect(() => {
    getAllTheUsers();
  }, []);

  useEffect(() => {
    socket.on("message", (recievedData) => {
      console.log("message=>", recievedData); //used for recieving payload which is sent by the user
      setChatMessages((prev) => {
        console.log("prev", prev);
        console.log("recievedData", recievedData);
        return [...prev, recievedData];
      });
    });

    return () => {
      socket.disconnect(); //used for dis-connecting the socket
    };
  }, []);

  //   useEffect(() => {
  //     console.log("called");
  //     //on is used to recieve data from the socket
  //     socket.on("recieve_message", (data) => {
  //       //getting messages from the server
  //       console.log("data", data);
  //       setChatMessages((prev) => [...prev, data]); //it is used to store data in an array
  //     });
  //   }, [socket, room]);

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
              Chat
            </Typography>
            <Box display="flex" gap="20px">
              <Button onClick={() => setAddRoomModal(true)} fullWidth>
                Add Room
              </Button>
              <FormControl fullWidth>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={room}
                  renderValue={(selected) => {
                    if (selected === "") {
                      return "Select Room";
                    } else return selected.roomName;
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {roomsList?.map((item) => {
                    return (
                      <MenuItem
                        key={item}
                        // disabled={userEmail === item.email}
                        onClick={() => handleRoomChange(item)}
                      >
                        {item.roomName}
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
                      textAlign={
                        userEmail === item.user.email ? "right" : "left"
                      }
                      id="modal-modal-description"
                    >
                      {item.message}
                    </Typography>
                    <Typography
                      fontSize="11px"
                      textAlign={
                        userEmail === item.user.email ? "right" : "left"
                      }
                    >
                      {item.user.firstName +
                        "    " +
                        item.date +
                        " " +
                        item.time}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Box display="flex" alignItems="center" width="100%" gap="15px">
              <TextField
                sx={{ width: "100%" }}
                type="text"
                placeholder="Enter text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <IconButton disabled={!room?.roomName || !message.length}>
                <SendIcon sx={{ cursor: "pointer" }} onClick={handleSubmit} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Modal>

      {addRoomModal && (
        <AddRoomModal
          addRoomModal={addRoomModal}
          onHide={() => setAddRoomModal(false)}
        />
      )}
    </div>
  );
}
