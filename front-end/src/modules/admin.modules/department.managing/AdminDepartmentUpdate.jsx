import {
  Button,
  Container,
  Grid,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  name: yup.string().required("Tên phòng ban không được để trống"),
  parent_id: yup.string().nullable(),
  status: yup.string().required(),
});

function AdminDepartmentUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [departments, setDepartments] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      parent_id: "",
      status: "active",
    },
  });

  // Fetch danh sách phòng ban
  useEffect(() => {
    axios
      .get("http://localhost:9999/departments/get-all")
      .then((response) => {
        setDepartments(response.data.departments);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch phòng ban:", error);
      });
  }, []);

  // Fetch dữ liệu phòng ban theo ID
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/departments/get-one/${id}`
        );
        const departmentData = response.data.oneDepartment;

        // Đổ dữ liệu vào form
        setValue("name", departmentData.name);
        setValue("parent_id", departmentData.parent_id || "");
        setValue("status", departmentData.status);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phòng ban:", error);
      }
    };

    if (id) {
      fetchDepartment();
    }
  }, [id, setValue]);

  const onSubmittted = async (data) => {
    try {
      console.log("Form data:", data);
      const response = await axios.put(
        `http://localhost:9999/departments/update/${id}`,
        data
      );
      console.log("Cập nhật thành công:", response.data);
      navigate("/admin/departments"); // Chuyển hướng sau khi cập nhật
    } catch (error) {
      console.error("Lỗi khi cập nhật phòng ban:", error);
    }
  };

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <Typography fontWeight="bold" variant="h4">
        Cập nhật phòng ban
      </Typography>
      <Button
        sx={{ mt: 2, mb: 2 }}
        variant="outlined"
        onClick={() => navigate("/admin/departments")}
      >
        Quay trở lại
      </Button>
      <form onSubmit={handleSubmit(onSubmittted)}>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <TextField
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              margin="normal"
              label="Tên phòng ban"
              variant="outlined"
              fullWidth
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                {...register("parent_id")}
                value={watch("parent_id") || ""}
                onChange={(e) => setValue("parent_id", e.target.value)}
              >
                <MenuItem value="">Không có</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                {...register("status")}
                value={watch("status") || "active"}
                onChange={(e) => setValue("status", e.target.value)}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <Button
              sx={{ mt: 2 }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Cập nhật phòng ban
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default AdminDepartmentUpdate;
