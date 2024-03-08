import {
  Box,
  Button,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  height: "320px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  padding: "20px",
};

const AddRoomModal = ({ addRoomModal, onHide }) => {
//   const [usersList, setUsersList] = useState(null);
  const [roomText, setRoomText] = useState("");
  //   const [personName, setPersonName] = useState([]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    // if (!roomText || !personName?.length) return;
    try {
      const resp = await axios.post(`${process.env.REACT_APP_API_ROOT}room`, {
        roomName: roomText,
        // peoples: personName?.map((it) => it._id),
      });
      if (resp?.status === 201) {
        // setPersonName([])
        setRoomText("");
        onHide();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  
//   const getAllTheUsers = async () => {
//     try {
//       const resp = await axios.get(`${process.env.REACT_APP_API_ROOT}users`);
//       if (resp?.status) {
//         setUsersList(resp?.data);
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

  //   useEffect(() => {
  //     getAllTheUsers();
  //   }, []);

//   const handleChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setPersonName(value);
//   };

  return (
    <Modal
      open={addRoomModal}
      onClose={onHide}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Add Room</Typography>
          <CloseIcon sx={{ cursor: "pointer" }} onClick={onHide} />
        </Box>
        <form style={{ marginTop: "20px" }} onSubmit={handleSubmitForm}>
          <TextField
            sx={{ width: "100%" }}
            type="text"
            placeholder="Enter room name"
            value={roomText}
            onChange={(e) => setRoomText(e.target.value)}
          />
          {/* <FormControl sx={{ marginTop: "20px" }} fullWidth>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              renderValue={(selected) => {
                return selected?.length
                  ? selected
                      .map((it) => it.firstName + " " + it.lastName)
                      ?.join(", ")
                  : "Add User";
              }}
              value={personName}
              onChange={handleChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {usersList?.map((item) => {
                return (
                  <MenuItem
                    key={item}
                    value={item}
                    // disabled={userEmail === item.email}
                  >
                    <Checkbox
                      checked={
                        personName
                          .map((it) => it.firstName + " " + it.lastName)
                          ?.indexOf(item.firstName + " " + item.lastName) > -1
                      }
                    />
                    <ListItemText
                      primary={item.firstName + " " + item.lastName}
                    />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl> */}
          <Box
            marginTop="20px"
            display="flex"
            justifyContent="end"
            alignItems="center"
          >
            <Button
              sx={{ marginRight: "20px" }}
              onClick={onHide}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
            {/* <Button disabled={!roomText || !personName?.length} type="submit" variant="contained"> */}
            <Button disabled={!roomText} type="submit" variant="contained">
              Add Room
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddRoomModal;
