import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().min(6, "Password must be at least 6 characters"),
  role: yup.string().required("Role is required"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  gender: yup.string().required("Gender is required"),
  employee_role: yup.string().required("Employee role is required"),
  department_id: yup.string().required("Department is required"),
  salary_level_id: yup.string().required("Salary level is required"),
  avatar: yup.string().url("Avatar must be a valid URL"),
});

function AdminCreateUser() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [salaryLevels, setSalaryLevels] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);

  console.log("im getting", salaryLevels);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    axios
      .get("http://localhost:9999/departments/get-all")
      .then((res) => {
        console.log("Departments API response:", res.data.departments);
        setDepartments(res.data.departments || []); // Đảm bảo dữ liệu luôn là mảng
      })
      .catch((err) => {
        console.error("Error fetching departments:", err);
        setDepartments([]); // Gán giá trị mặc định tránh lỗi
      });

    axios
      .get("http://localhost:9999/salary/get-all-salary")
      .then((res) => {
        console.log("Salary Levels API response:", res.data);
        setSalaryLevels(res.data.allTheSalary || []);
      })
      .catch((err) => {
        console.error("Error fetching salary levels:", err);
        setSalaryLevels([]);
      });
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    if (avatarFile) {
      formData.append("avatar", avatarFile); // Thêm ảnh vào formData
    }

    try {
      const response = await axios.post(
        "http://localhost:9999/users/create-user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("User created:", response.data);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleFileChange = (event) => {
    setAvatarFile(event.target.files[0]); // Lưu file vào state
  };

  return (
    <Container sx={{ mb: 5, mt: 5 }}>
      <Typography sx={{ fontWeight: "bold" }} variant="h4" gutterBottom>
        Thêm người dùng
      </Typography>
      <Button variant="outlined" onClick={() => navigate("/admin/dashboard")}>
        Quay trở lại
      </Button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              margin="normal"
              label="Username"
              variant="outlined"
              fullWidth
            />
            <TextField
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              margin="normal"
              type="password"
              label="Password"
              variant="outlined"
              fullWidth
            />
            <TextField
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              margin="normal"
              label="Name"
              variant="outlined"
              fullWidth
            />
            <TextField
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
              type="email"
              label="Email"
              variant="outlined"
              fullWidth
            />
            <TextField
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
              margin="normal"
              type="number"
              label="Phone Number"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Dropdown Gender */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                {...register("gender")}
                defaultValue=""
                onChange={(e) => setValue("gender", e.target.value)}
                error={!!errors.gender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            {/* Dropdown Role */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                {...register("role")}
                defaultValue=""
                onChange={(e) => setValue("role", e.target.value)}
                error={!!errors.role}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">Employee</MenuItem>
              </Select>
            </FormControl>

            <TextField
              {...register("employee_role")}
              error={!!errors.employee_role}
              helperText={errors.employee_role?.message}
              margin="normal"
              label="Employee Role"
              variant="outlined"
              fullWidth
              select // ✅ Kích hoạt chế độ dropdown cho TextField
            >
              <MenuItem value="offical">Official</MenuItem>
              <MenuItem value="intern">Intern</MenuItem>
              <MenuItem value="parttime">Part-time</MenuItem>
              <MenuItem value="contractor">Contractor</MenuItem>
            </TextField>

            {/* Dropdown Department */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                {...register("department_id")}
                defaultValue=""
                onChange={(e) => setValue("department_id", e.target.value)}
                error={!!errors.department_id}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Dropdown Salary Level */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Salary Level</InputLabel>
              <Select
                {...register("salary_level_id")}
                defaultValue=""
                onChange={(e) => setValue("salary_level_id", e.target.value)}
                error={!!errors.salary_level_id}
              >
                {salaryLevels.map((level) => (
                  <MenuItem key={level._id} value={level._id}>
                    {level.level_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {avatarFile && (
              <img
                src={URL.createObjectURL(avatarFile)}
                alt="Avatar preview"
                width="100"
                height="100"
                style={{ marginTop: 10 }}
              />
            )}
          </Grid>
        </Grid>
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Thêm người dùng
        </Button>
      </form>
    </Container>
  );
}

export default AdminCreateUser;
