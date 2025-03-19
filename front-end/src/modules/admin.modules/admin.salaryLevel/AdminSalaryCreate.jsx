import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Schema validation với Yup
const schema = yup.object().shape({
  level_name: yup.string().required("Tên bậc lương không được để trống"),
  salary_coefficient: yup
    .number()
    .typeError("Hệ số lương phải là số")
    .required("Hệ số lương không được để trống")
    .positive("Hệ số lương phải lớn hơn 0"),
  monthly_salary: yup
    .number()
    .typeError("Lương tháng phải là số")
    .required("Lương tháng không được để trống")
    .positive("Lương tháng phải lớn hơn 0"),
  daily_salary: yup
    .number()
    .typeError("Lương ngày phải là số")
    .required("Lương ngày không được để trống")
    .positive("Lương ngày phải lớn hơn 0"),
});

function AdminSalaryCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const navigate = useNavigate();

  const onSubmitted = async (data) => {
    try {
      console.log("Dữ liệu gửi đi:", data);
      await axios.post("http://localhost:9999/salary/create", data);
      alert("Thêm bậc lương thành công!");
      navigate("/admin/salaryLevels");
    } catch (error) {
      console.error("Lỗi khi thêm bậc lương:", error);
    }
  };

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <Typography fontWeight="bold" variant="h4">
        Thêm bậc lương
      </Typography>
      <Button
        sx={{ mt: 2, mb: 2 }}
        variant="outlined"
        onClick={() => navigate("/admin/salaryLevels")}
      >
        Quay lại
      </Button>
      <form onSubmit={handleSubmit(onSubmitted)}>
        <Grid container spacing={2}>
          <Grid item md={6}>
            {/* Tên bậc lương */}
            <TextField
              {...register("level_name")}
              error={!!errors.level_name}
              helperText={errors.level_name?.message}
              margin="normal"
              label="Tên bậc lương"
              variant="outlined"
              fullWidth
            />

            {/* Hệ số lương */}
            <TextField
              {...register("salary_coefficient")}
              error={!!errors.salary_coefficient}
              helperText={errors.salary_coefficient?.message}
              margin="normal"
              label="Hệ số lương"
              variant="outlined"
              fullWidth
            />

            {/* Lương tháng */}
            <TextField
              {...register("monthly_salary")}
              error={!!errors.monthly_salary}
              helperText={errors.monthly_salary?.message}
              margin="normal"
              label="Lương tháng"
              variant="outlined"
              fullWidth
            />

            {/* Lương ngày */}
            <TextField
              {...register("daily_salary")}
              error={!!errors.daily_salary}
              helperText={errors.daily_salary?.message}
              margin="normal"
              label="Lương ngày"
              variant="outlined"
              fullWidth
            />

            <Button
              sx={{ mt: 2 }}
              variant="contained"
              color="primary"
              type="submit"
            >
              Tạo bậc lương
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default AdminSalaryCreate;
