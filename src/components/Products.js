import { useEffect, useState } from "react";
import { Box, Button, Pagination, TableSortLabel } from "@mui/material";
import AddProductModal from "../components/AddProductModal";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import InputField from "../reuseables/InputField";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
import { io } from "socket.io-client";
import ChatModal from "./ChatModal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const tableHeadings = [
  "S.No.",
  "Title",
  "Description",
  "Price",
  "Rating",
  "Brand",
  "Thumbnail",
  "Actions",
];

const limit = 3;

const Products = () => {
  const navigate = useNavigate();
  const [productModal, setProductModal] = useState(false);
  const [arrowDirection, setArrowDirection] = useState(false); //false means up
  const [arrowIndex, setArrowIndex] = useState(null);
  const [productList, setProductList] = useState();
  const [singleItem, setSingleItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [chatModal, setChatModal] = useState(false);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState();

  //sortNumber
  const [sort, setSort] = useState({
    state: "",
    name: "",
  });

  const userToken = JSON.parse(localStorage.getItem("webUserToken"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;

  const getAllTheProducts = async () => {
    try {
      const resp = await axios.get(
        `${
          process.env.REACT_APP_API_ROOT
        }products?limit=${limit}&offset=${currentPage}&search=${searchText}&order_by=${sort.name.toLocaleLowerCase()}&order_type=${
          sort.state
        }`
      );
      if (resp?.status) {
        setProductList(resp?.data);
        setTotalCount(Math.ceil(resp?.data?.total_products / 3));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!productModal) {
      getAllTheProducts();
    }
  }, [productModal, currentPage, searchText, sort]);

  const handleEdit = (item) => {
    setSingleItem(item);
    setProductModal(true);
  };

  const handleDelete = async (item) => {
    try {
      const resp = await axios.delete(
        `${process.env.REACT_APP_API_ROOT}products/${item}`
      );
      if (resp?.status) {
        getAllTheProducts();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("webUserToken");
    navigate("/");
  };

  const handlePagination = (value) => {
    setCurrentPage(value);
  };

  const handleArrowUp = (index, item) => {
    setSort({
      state: "asc",
      name: item,
    });
    setArrowIndex(index);
    setArrowDirection(false);
  };

  const handleArrowDown = (index, item) => {
    setSort({
      state: "desc",
      name: item,
    });
    setArrowIndex(index);
    setArrowDirection(true);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        gap="20px"
        padding="20px"
      >
        <Button
          variant="contained"
          onClick={() => {
            setSingleItem(null);
            setProductModal(true);
          }}
        >
          Add Product
        </Button>
        <Button variant="contained" onClick={() => handleLogout()}>
          Logout
        </Button>
        <Button variant="contained" onClick={() => setChatModal(true)}>
          Chat
        </Button>
      </Box>
      <Box padding="10px">
        <InputField
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by title"
          label="Search"
        />
        <TableContainer sx={{ margin: "20px 0" }} component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {tableHeadings.map((item, index) => (
                  <StyledTableCell align="center" key={item}>
                    <Box display="flex" gap="5px" alignItems="center">
                      {item}
                      {item !== "Thumbnail" &&
                        item !== "S.No." &&
                        item !== "Actions" &&
                        (arrowIndex === index && arrowDirection ? (
                          <ArrowDownwardIcon
                            onClick={() => handleArrowUp(index, item)}
                            sx={{ cursor: "pointer" }}
                          />
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => handleArrowDown(index, item)}
                            sx={{ cursor: "pointer" }}
                          />
                        ))}
                    </Box>
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {productList?.allProducts?.map((item, index) => {
                return (
                  <StyledTableRow key={item.id}>
                    <StyledTableCell align="center">
                      {currentPage === 1
                        ? index + 1
                        : currentPage * limit - limit + index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.title}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.description}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.price}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.rating}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.brand}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <img
                        src={item.thumbnail}
                        alt="item.thumbnail"
                        height="60"
                        width="60"
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Box display="flex" gap="15px" justifyContent="flex-end">
                        <EditIcon
                          onClick={() => handleEdit(item)}
                          sx={{ cursor: "pointer", color: "#1976D2" }}
                        />
                        <DeleteIcon
                          onClick={() => handleDelete(item._id)}
                          sx={{ cursor: "pointer", color: "#1976D2" }}
                        />
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box padding="10px" display="flex" justifyContent="flex-end">
            <Pagination
              page={currentPage}
              onChange={(e, value) => handlePagination(value)}
              variant="outlined"
              shape="rounded"
              count={totalCount}
            />
          </Box>
        </TableContainer>
      </Box>
      {productModal && (
        <AddProductModal
          productModal={productModal}
          onHide={() => setProductModal(false)}
          singleItem={singleItem}
        />
      )}

      {chatModal && (
        <ChatModal chatModal={chatModal} onHide={() => setChatModal(false)} />
      )}
    </>
  );
};

export default Products;
