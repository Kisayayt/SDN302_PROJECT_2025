import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";

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

function AdminSalaryUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  // Fetch dữ liệu bậc lương theo ID
  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/salary/getOneSalary/${id}`
        );
        console.log("Data nhận được:", response.data.onesalary);
        const salaryData = response.data.onesalary;

        // Đổ dữ liệu vào form
        setValue("level_name", salaryData.level_name);
        setValue("salary_coefficient", salaryData.salary_coefficient);
        setValue("monthly_salary", salaryData.monthly_salary);
        setValue("daily_salary", salaryData.daily_salary);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bậc lương:", error);
      }
    };

    if (id) {
      fetchSalary();
    }
  }, [id, setValue]);

  // Xử lý submit form cập nhật
  const onSubmitted = async (data) => {
    try {
      console.log("Dữ liệu gửi đi:", data);
      await axios.put(`http://localhost:9999/salary/updateSalary/${id}`, data);
      alert("Cập nhật bậc lương thành công!");
      navigate("/admin/salaryLevels"); // Quay lại danh sách bậc lương sau khi cập nhật
    } catch (error) {
      console.error("Lỗi khi cập nhật bậc lương:", error);
    }
  };

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      <Typography fontWeight="bold" variant="h4">
        Cập nhật bậc lương
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
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            {/* Lương tháng */}
            <TextField
              {...register("monthly_salary")}
              error={!!errors.monthly_salary}
              helperText={errors.monthly_salary?.message}
              margin="normal"
              label="Lương tháng"
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <Button
              sx={{ mt: 2 }}
              variant="contained"
              color="primary"
              type="submit"
            >
              Cập nhật bậc lương
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default AdminSalaryUpdate;
