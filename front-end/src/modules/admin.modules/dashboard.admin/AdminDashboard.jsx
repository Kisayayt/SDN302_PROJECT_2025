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
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Grid";
import SideBar from "../../../components/employee/SideBar";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Bắt đầu từ 0 để tương thích với TablePagination
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số user mỗi trang

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

  // Fetch danh sách users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:9999/users/get-all-users?page=${
            currentPage + 1
          }&limit=${rowsPerPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách người dùng");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, rowsPerPage]); // Gọi lại API khi currentPage hoặc rowsPerPage thay đổi

  return (
    <Container sx={{ mb: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 5, mb: 3 }}>
        Trang chủ
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12} md={3}>
          <SideBar />
        </Grid2>
        <Grid2 item xs={12} md={9}>
          {/* Hiển thị danh sách user bằng Table */}
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      {user.gender === "male" ? "Nam" : "Nữ"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone_number}</TableCell>
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
