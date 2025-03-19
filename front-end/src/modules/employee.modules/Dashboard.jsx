import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  dayjs.extend(utc);
  dayjs.extend(timezone);
  const today = dayjs().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");

  const todayHistory = historyData.filter((record) => {
    const recordDate = dayjs(record.time)
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD");
    return recordDate === today;
  });
  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9999/attendance-by-user/history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Lịch sử:", response.data);
      setHistoryData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử check-in/out:", error);
    }
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    fetchHistory(); // Gọi API lấy lịch sử khi bấm nút
  };

  const handleBack = () => {
    setShowHistory(false);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Token:", localStorage.getItem("token"));
        const response = await axios.get(
          "http://localhost:9999/attendance-by-user/get-profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }, // Gửi token
          }
        );
        console.log("Data nhận được:", response.data.user);
        setUser(response.data.user);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    fetchUserData();
  }, []);
  useEffect(() => {
    const checkAttendanceStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9999/attendance-by-user/status",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }, // Gửi token
          }
        );
        setIsCheckedIn(response.data.isCheckedIn);
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái check-in:", error);
      }
    };

    checkAttendanceStatus();
  }, []);

  const handleCheckInOut = async () => {
    try {
      const endpoint = isCheckedIn
        ? "http://localhost:9999/attendance-by-user/check-out"
        : "http://localhost:9999/attendance-by-user/check-in";

      await axios.post(
        endpoint,
        {}, // Không cần gửi user_id
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Gửi token
        }
      );

      setIsCheckedIn(!isCheckedIn);
    } catch (error) {
      console.error("Lỗi khi check-in/check-out:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log(decoded);

      if (decoded.role !== "user") {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      {!showHistory ? (
        <Grid container sx={{ mt: 3, height: "500px" }}>
          {/* Bảng thông tin người dùng */}
          <Grid item md={4}>
            <Box
              component="img"
              src={
                user.avatar
                  ? `http://localhost:9999${user.avatar}`
                  : "/images/default2.jpg"
              }
              sx={{
                width: "300px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "20px",
              }}
            ></Box>
            <Stack>
              <Button
                variant="contained"
                color={isCheckedIn ? "error" : "success"}
                onClick={handleCheckInOut}
                sx={{ borderRadius: "20px", width: "300px", mt: 3 }}
              >
                {isCheckedIn ? "Check-out" : "Check-in"}
              </Button>
              <Button
                variant="outlined"
                sx={{ borderRadius: "20px", width: "300px", mt: 1 }}
                onClick={handleShowHistory}
              >
                Lịch sử checkin-out
              </Button>
              <Button
                sx={{
                  borderRadius: "20px",
                  width: "300px",
                  mt: 1,
                }}
                color="error"
                variant="outlined"
                onClick={handleLogout}
              >
                {" "}
                Log out
              </Button>
            </Stack>
          </Grid>
          <Grid item md={8}>
            <Box
              sx={{
                border: "1px solid #ccc",
                p: 4,
                borderRadius: "20px",
                height: "300px",
              }}
            >
              <Stack direction={"column"} spacing={1}>
                <Stack alignItems={"center"} direction={"row"} spacing={2}>
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: "30px" }}
                    variant="h6"
                  >
                    About - {user.name}
                  </Typography>
                  <Box
                    sx={{
                      padding: "5px 20px",
                      borderRadius: "20px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {user.employee_role}
                  </Box>
                  {user.gender === "male" ? (
                    <MaleIcon />
                  ) : user.gender === "female" ? (
                    <FemaleIcon />
                  ) : (
                    <TransgenderIcon />
                  )}
                </Stack>
                <Typography sx={{ fontSize: "15px" }} variant="h6">
                  <strong>Username: </strong> {user.username}
                </Typography>
                <Typography sx={{ fontSize: "15px" }} variant="h6">
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography sx={{ fontSize: "15px" }} variant="h6">
                  <strong>Phone:</strong> {user.phone_number}
                </Typography>
                <Typography sx={{ fontSize: "15px" }} variant="h6">
                  <strong>Department:</strong> {user.department_id?.name}
                </Typography>
                <Typography sx={{ fontSize: "15px" }} variant="h6">
                  <strong>Salary Level:</strong>{" "}
                  {user.salary_level_id?.level_name} -{" "}
                  {user.salary_level_id?.salary_coefficient}
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Lịch sử Check-in/Check-out
          </Typography>
          <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
            Quay lại
          </Button>
          <Box sx={{ border: "1px solid #ccc", borderRadius: "10px", p: 3 }}>
            <table width="100%">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Loại</th>
                </tr>
              </thead>
              <tbody>
                {todayHistory.length > 0 ? (
                  todayHistory.map((record, index) => (
                    <tr key={index}>
                      <td>
                        {dayjs(record.time)
                          .tz("Asia/Ho_Chi_Minh")
                          .format("HH:mm:ss")}
                      </td>
                      <td>{record.type === "in" ? "Check-in" : "Check-out"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">Không có dữ liệu check-in/out hôm nay</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default Dashboard;
