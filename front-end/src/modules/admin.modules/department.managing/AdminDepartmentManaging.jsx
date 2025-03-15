import { Box, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
// import { Container } from "react-bootstrap";
import Grid2 from "@mui/material/Grid2";
import Sidebar from "../../../components/employee/SideBar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
function AdminDepartmentManaging() {
  const navigate = useNavigate();
  console.log("admin is in here once");

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
            <Box sx={{ bgcolor: "red", height: "100px" }}>Item-2</Box>
          </Grid2>
        </Grid2>
      </Container>
    </div>
  );
}

export default AdminDepartmentManaging;
