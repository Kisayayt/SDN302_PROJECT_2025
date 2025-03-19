import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Avatar,
  TextField,
  InputAdornment,
  Stack,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Grid";
import SideBar from "../../../components/employee/SideBar";
import axios from "axios";
import { blue } from "@mui/material/colors";
import SearchIcon from "@mui/icons-material/Search";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [searchQuery, setSearchQuery] = useState("");

  console.log("Admin Dashboard loaded");

  // Kiểm tra quyền truy cập
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
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:9999/users/get-all-users`,
        {
          params: {
            page: currentPage + 1, // API thường bắt đầu từ trang 1
            limit: rowsPerPage,
            search: searchQuery.trim(), // Bỏ khoảng trắng thừa
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Không thể tải danh sách người dùng");
    }
  };
  // Fetch danh sách users
  useEffect(() => {
    fetchUsers();
  }, [currentPage, rowsPerPage, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, rowsPerPage, searchQuery]);
  // Gọi lại API khi currentPage hoặc rowsPerPage thay đổi

  const handleDelete = (id) => {
    console.log(id);
    axios.delete(`http://localhost:9999/users/delete-user/${id}`);

    fetchUsers();
    alert("Xóa người dùng");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Trang chủ
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12} md={3}>
          <SideBar />
        </Grid2>
        <Grid2 item xs={12} md={9}>
          <Stack direction="row" spacing={2}>
            {" "}
            <TextField
              label="Tìm kiếm người dùng"
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
              onClick={() => navigate("/admin/users/create")}
            >
              {" "}
              Thêm người dùng
            </Button>
          </Stack>
          {/* Hiển thị danh sách user bằng Table */}
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Avatar</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tên</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Giới tính</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Phone</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Update</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Delete</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Avatar
                        sx={{
                          bgcolor: blue,
                          cursor: "pointer",
                          transition: "0.3s",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        src={`http://localhost:9999${user.avatar}`}
                        variant="square"
                        onClick={() =>
                          navigate(`/admin/users/detail/${user._id}`)
                        } // Chuyển trang khi click
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      {user.gender === "male" ? "Nam" : "Nữ"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone_number}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          navigate(`/admin/users/update/${user._id}`)
                        }
                      >
                        Update
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                    <TableCell></TableCell>
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
  );
}

export default AdminDashboard;
