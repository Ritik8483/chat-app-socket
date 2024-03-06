import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import InputField from "../reuseables/InputField";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

const AddProductModal = (props) => {
  const { productModal, onHide, singleItem } = props;
  const [inputValues, setInputValues] = useState(
    singleItem || {
      title: "",
      description: "",
      price: "",
      rating: "",
      brand: "",
      thumbnail: "",
    }
  );

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValues((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };
  console.log(process.env.REACT_APP_API_ROOT);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (singleItem?._id) {
      try {
        const resp = await axios.patch(
          `${process.env.REACT_APP_API_ROOT}products/${singleItem?._id}`,
          inputValues
        );
        if (resp?.status) {
          onHide();
        }
        console.log("resp", resp);
      } catch (error) {
        console.log("error", error);
      }
    } else {
      try {
        const resp = await axios.post(
          `${process.env.REACT_APP_API_ROOT}products`,
          inputValues
        );
        if (resp?.status) {
          onHide();
        }
        console.log("resp", resp);
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  return (
    <>
      <Modal
        open={productModal}
        onClose={onHide}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography marginBottom="10px" variant="h5">
            {singleItem?._id ? "Edit" : "Add"} Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box width="100%" display="flex" flexDirection="column" gap="20px">
              <InputField
                type="text"
                placeholder="Title"
                label="Title"
                name="title"
                value={inputValues.title}
                onChange={(e) => handleChange(e)}
              />
              <InputField
                type="text"
                placeholder="Description"
                label="Description"
                name="description"
                value={inputValues.description}
                onChange={(e) => handleChange(e)}
              />
              <InputField
                type="number"
                placeholder="Price"
                label="Price"
                name="price"
                value={inputValues.price}
                onChange={(e) => handleChange(e)}
              />
              <InputField
                type="number"
                placeholder="Rating"
                label="Rating"
                name="rating"
                value={inputValues.rating}
                onChange={(e) => handleChange(e)}
              />
              <InputField
                type="text"
                placeholder="Brand"
                label="Brand"
                name="brand"
                value={inputValues.brand}
                onChange={(e) => handleChange(e)}
              />
              <InputField
                type="url"
                placeholder="Thumbnail"
                label="Thumbnail"
                name="thumbnail"
                value={inputValues.thumbnail}
                onChange={(e) => handleChange(e)}
              />
              <Box
                display="flex"
                gap="20px"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Button variant="contained" color="secondary" onClick={onHide}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" color="primary">
                  {singleItem?._id ? "Update" : "Submit"}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddProductModal;
