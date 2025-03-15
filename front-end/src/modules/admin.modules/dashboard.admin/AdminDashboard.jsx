import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Grid";
import SideBar from "../../../components/employee/SideBar";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // State để lưu danh sách người dùng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Gọi API lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data); // Lưu danh sách user vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
        setError("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 5, mb: 3 }}>
        Trang chủ
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12} md={3}>
          <SideBar />
        </Grid2>
        <Grid2 item xs={12} md={9}>
          <Box sx={{ bgcolor: "blue", height: "100px", mb: 3 }}>Item-2</Box>

          {/* Hiển thị danh sách user */}
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Danh sách người dùng
          </Typography>
          {loading ? (
            <Typography>Đang tải...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <List>
              {users.map((user) => (
                <ListItem
                  key={user._id}
                  sx={{ borderBottom: "1px solid #ddd" }}
                >
                  <ListItemText primary={`${user.name} - ${user.email}`} />
                </ListItem>
              ))}
            </List>
          )}
        </Grid2>
      </Grid2>
    </Container>
  );
}

export default AdminDashboard;
