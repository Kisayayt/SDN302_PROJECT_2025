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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required("Tên phòng ban không được để trống"),
  parent_id: yup.string().nullable(),
  status: yup.string().required(),
});

function AdminDepartmentCreate() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "active",
    },
    mode: "onBlur",
  });

  const [departments, setDepartments] = useState([]);
  const currentName = watch("name");
  const parentId = watch("parent_id");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9999/departments/get-all") // API lấy danh sách phòng ban
      .then((response) => {
        setDepartments(response.data.departments);
      })
      .catch((error) => {
        console.error("Lỗi khi fetch phòng ban:", error);
      });
  }, []);

  const onSubmitted = async (data) => {
    try {
      // Nếu parent_id là rỗng (""), thì gán null
      const payload = {
        ...data,
        parent_id: data.parent_id === "" ? null : data.parent_id,
      };

      console.log(payload);
      await axios.post("http://localhost:9999/departments/create", payload);
      alert("Thêm phòng ban thành công");
    } catch (error) {
      console.error("Lỗi khi thêm phòng ban:", error);
    }
  };

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <Typography fontWeight="bold" variant="h4">
        Thêm phòng ban
      </Typography>
      <Button
        sx={{ mt: 2, mb: 2 }}
        variant="outlined"
        onClick={() => navigate("/admin/departments")}
      >
        Quay trở lại
      </Button>
      <form onSubmit={handleSubmit(onSubmitted)}>
        <Grid container spacing={2}>
          <Grid item md={6}>
            {/* Ô nhập tên phòng ban */}
            <TextField
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              margin="normal"
              label="Tên phòng ban"
              variant="outlined"
              fullWidth
            />

            {/* Dropdown chọn phòng ban cha */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                {...register("parent_id")}
                defaultValue=""
                onChange={(e) => setValue("parent_id", e.target.value)}
                error={!!errors.parent_id}
              >
                <MenuItem value="">Không có</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Dropdown chọn trạng thái */}
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
              variant="contained"
              color="primary"
              type="submit"
            >
              Tạo phòng ban
            </Button>
          </Grid>
          <Grid item md={6}></Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default AdminDepartmentCreate;
