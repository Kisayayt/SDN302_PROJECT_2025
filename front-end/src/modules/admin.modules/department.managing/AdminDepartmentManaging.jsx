import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  InputAdornment,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
// import { Container } from "react-bootstrap";
import Grid2 from "@mui/material/Grid2";
import Sidebar from "../../../components/employee/SideBar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
function AdminDepartmentManaging() {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [departments, setDepartments] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  console.log("admin is in here once");
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:9999/departments/get-all`,
        {
          params: {
            page: currentPage + 1, // API thường bắt đầu từ trang 1
            limit: rowsPerPage,
            search: searchQuery.trim(), // Bỏ khoảng trắng thừa
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDepartments(response.data.departments);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  // Khi thay đổi trang hoặc số dòng trên trang
  useEffect(() => {
    fetchDepartments();
  }, [currentPage, rowsPerPage]);

  // Khi thay đổi searchQuery, reset về trang 1 và fetch lại
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  useEffect(() => {
    fetchDepartments();
  }, [searchQuery]); // Bổ sung fetch khi searchQuery thay đổi

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dùng để kiểm tra xem người dùng đã đăng nhập chưa và có phải là employee không
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log(decoded);

      if (decoded.role !== "admin") {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      axios.delete(`http://localhost:9999/departments/delete/${id}`);
      alert("Xóa phòng ban");
      fetchDepartments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Container>
        <Typography variant="h4" sx={{ fontWeight: "bold", mt: 5, mb: 3 }}>
          Trang chủ
        </Typography>
        <Grid2 sx={{ mb: 5 }} container>
          <Grid2 item size={{ xs: 12, md: 3 }}>
            <Sidebar />
          </Grid2>
          <Grid2 item size={{ xs: 12, md: 9 }}>
            <Stack direction="row" spacing={2}>
              {" "}
              <TextField
                label="Tìm kiếm phòng ban"
                variant="outlined"
                sx={{ mb: 2 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={() => navigate("/admin/departments/create")}
              >
                {" "}
                Thêm phòng ban
              </Button>
            </Stack>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Update</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Delete</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Details</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDepartments.map((department) => (
                    <TableRow key={department._id}>
                      <TableCell>
                        <strong>{department.name}</strong>
                      </TableCell>

                      <TableCell>{department.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() =>
                            navigate(
                              `/admin/departments/update/${department._id}`
                            )
                          }
                        >
                          Update
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(department._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() =>
                            navigate(
                              `/admin/departments/detail/${department._id}`
                            )
                          }
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={totalPages * rowsPerPage}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onPageChange={(event, newPage) => setCurrentPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setCurrentPage(0);
              }}
            />
          </Grid2>
        </Grid2>
      </Container>
    </div>
  );
}

export default AdminDepartmentManaging;
