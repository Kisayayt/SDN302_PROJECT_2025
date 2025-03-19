import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

function AdminDetailUser() {
  const { id } = useParams();

  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/users/get-one-user/${id}`
        );
        console.log("Data nhận được:", response.data.user);
        setUser(response.data.user);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };

    fetchUser();
  }, [id]);
  return (
    <div>
      <Container sx={{ mt: 5, mb: 5 }}>
        <Typography sx={{ mb: 3 }} fontWeight={"bold"} variant="h4">
          Chi tiết người dùng
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/admin/dashboard")}>
          Quay trở lại
        </Button>
        <Grid container sx={{ mt: 3, height: "500px" }}>
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
      </Container>
    </div>
  );
}

export default AdminDetailUser;
