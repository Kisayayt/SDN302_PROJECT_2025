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
  FormHelperText,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Schema validation
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .nullable() // Cho phép null
    .notRequired(), // Không bắt buộc
  role: yup.string().required("Role is required"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  gender: yup.string().required("Gender is required"),
  employee_role: yup.string().required("Employee role is required"),
  department_id: yup.string().required("Department is required"),
  salary_level_id: yup.string().required("Salary level is required"),
});

function AdminUpdateUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [departments, setDepartments] = useState([]);
  const [salaryLevels, setSalaryLevels] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      gender: "",
      role: "",
      employee_role: "",
      department_id: "",
      salary_level_id: "",
    },
  });

  useEffect(() => {
    // Load danh sách phòng ban & mức lương
    const fetchData = async () => {
      try {
        const [deptRes, salaryRes, userRes] = await Promise.all([
          axios.get("http://localhost:9999/departments/get-all"),
          axios.get("http://localhost:9999/salary/get-all-salary"),
          axios.get(`http://localhost:9999/users/get-one-user/${id}`),
        ]);

        setDepartments(deptRes.data.departments || []);
        setSalaryLevels(salaryRes.data.allTheSalary || []);

        const user = userRes.data.user;
        setUserData(user);
        console.log("User data:", user);

        // Chuẩn bị dữ liệu cho form
        const formData = {
          username: user.username || "",
          name: user.name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          gender: user.gender || "",
          role: user.role || "",
          employee_role: user.employee_role || "",
          department_id: user.department_id?._id || "",
          salary_level_id: user.salary_level_id?._id || "",
          password: "", // Để trống cho trường password
        };

        // Reset form với dữ liệu chuẩn bị
        reset(formData);

        // Hiển thị ảnh cũ nếu có
        if (user.avatar) {
          setAvatarPreview(`http://localhost:9999${user.avatar}`);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load user data");
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmittted = async (data) => {
    setLoading(true);
    setError("");
    console.log("Form data:", data);

    try {
      const formData = new FormData();

      // Thêm các trường vào FormData
      Object.keys(data).forEach((key) => {
        // Chỉ thêm password nếu nó không phải là chuỗi rỗng
        if (key === "password" && (!data[key] || data[key].trim() === "")) {
          return;
        }
        formData.append(key, data[key]);
      });

      // Thêm avatar nếu có
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Debug FormData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axios.put(
        `http://localhost:9999/users/update-user/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("User updated:", response.data);
      alert("Cập nhật thành công!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.response?.data?.message || "Error updating user");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Nếu chưa tải xong dữ liệu, hiển thị loading
  if (!userData) {
    return (
      <Container sx={{ mb: 5, mt: 5 }}>
        <Typography variant="h6">Đang tải dữ liệu người dùng...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mb: 5, mt: 5 }}>
      <Typography sx={{ fontWeight: "bold" }} variant="h4" gutterBottom>
        Cập nhật người dùng
      </Typography>
      <Button
        variant="outlined"
        onClick={() => navigate("/admin/dashboard")}
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>

      {error && <Box sx={{ color: "error.main", mb: 2 }}>{error}</Box>}

      <form onSubmit={handleSubmit(onSubmittted)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              {...register("username")}
              label="Username"
              fullWidth
              disabled
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              {...register("name")}
              label="Name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register("email")}
              label="Email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register("phone_number")}
              label="Phone Number"
              fullWidth
              margin="normal"
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Gender */}
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Select {...field} label="Gender">
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {errors.gender && (
                    <FormHelperText>{errors.gender.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Employee Role */}
            <Controller
              name="employee_role"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.employee_role}
                >
                  <InputLabel>Employee Role</InputLabel>
                  <Select {...field} label="Employee Role">
                    <MenuItem value="offical">Official</MenuItem>
                    <MenuItem value="intern">Intern</MenuItem>
                    <MenuItem value="parttime">Part-time</MenuItem>
                    <MenuItem value="contractor">Contractor</MenuItem>
                  </Select>
                  {errors.employee_role && (
                    <FormHelperText>
                      {errors.employee_role.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Role */}
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.role}>
                  <InputLabel>Role</InputLabel>
                  <Select {...field} label="Role">
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">Employee</MenuItem>
                  </Select>
                  {errors.role && (
                    <FormHelperText>{errors.role.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Department */}
            <Controller
              name="department_id"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.department_id}
                >
                  <InputLabel>Department</InputLabel>
                  <Select {...field} label="Department">
                    {departments.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.department_id && (
                    <FormHelperText>
                      {errors.department_id.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Salary Level */}
            <Controller
              name="salary_level_id"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.salary_level_id}
                >
                  <InputLabel>Salary Level</InputLabel>
                  <Select {...field} label="Salary Level">
                    {salaryLevels.map((level) => (
                      <MenuItem key={level._id} value={level._id}>
                        {level.level_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.salary_level_id && (
                    <FormHelperText>
                      {errors.salary_level_id.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <TextField
              {...register("password")}
              label="New Password (Leave blank to keep current)"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Avatar
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginBottom: "10px" }}
              />

              {avatarPreview && (
                <Box sx={{ mt: 1 }}>
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    width="100"
                    height="100"
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          type="submit"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Cập nhật người dùng"}
        </Button>
      </form>
    </Container>
  );
}

export default AdminUpdateUser;
