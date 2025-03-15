import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PasswordIcon from "@mui/icons-material/Password";
import {
  Alert,
  Box,
  Button,
  Container,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import AccountCircle from "@mui/icons-material/AccountCircle";

import PersonalVideoOutlinedIcon from "@mui/icons-material/PersonalVideoOutlined";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
      return;
    }
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:9999/auth/login", data);
      localStorage.setItem("token", res.data.token);

      const decoded = jwtDecode(res.data.token);
      navigate(decoded.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch {
      setOpen(true);
      setError("Username or password is incorrect");
    }
  };

  return (
    <div
      style={{
        background: "url(/images/anhbackground.png)",
        backgroundSize: "cover",
        // backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            p: 3,
            boxShadow: 3,
            borderRadius: 5,
            bgcolor: "rgba(255, 255, 255, 0.49)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{ fontWeight: "bold", fontSize: "30px" }}
            variant="h5"
            gutterBottom
          >
            <PersonalVideoOutlinedIcon /> LOGIN
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Container>

      <Snackbar
        open={open}
        autoHideDuration={3000} // Ẩn sau 3 giây
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // Góc trái dưới
      >
        <Alert onClose={() => setOpen(false)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;
