import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Sidebar from "../../../components/employee/SideBar";
import { useNavigate } from "react-router-dom";

function AdminSalary() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [salaries, setSalaries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);

  const navigate = useNavigate();

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9999/salary/getSalary",
        {
          params: {
            page: currentPage + 1,
            limit: rowsPerPage,
            search: searchQuery.trim(),
          },
        }
      );

      setSalaries(response.data.salaries);
      setTotalPages(Math.ceil(response.data.totalCount / rowsPerPage));
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [currentPage, rowsPerPage, searchQuery]);

  const handleOpenDetail = async (salaryId) => {
    try {
      const response = await axios.get(
        `http://localhost:9999/salary/getOneSalary/${salaryId}`
      );
      setSelectedSalary(response.data.onesalary);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching salary detail:", error);
    }
  };

  const handleDelete = async (salaryId) => {
    try {
      await axios.delete(
        `http://localhost:9999/salary/deleteSalary/${salaryId}`
      );
      fetchSalaries();
    } catch (error) {
      console.error("Error deleting salary:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 5, mb: 3 }}>
        Quản lý lương
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Sidebar />
        </Grid>

        <Grid item xs={12} md={9}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Tìm kiếm bậc lương"
              variant="outlined"
              sx={{ mb: 2 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={() => navigate("/admin/createSalary")}
            >
              Thêm bậc lương
            </Button>
          </Stack>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Mức lương</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Update</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Details</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Delete</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salaries.map((salary) => (
                  <TableRow key={salary._id}>
                    <TableCell>{salary.level_name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() =>
                          navigate(`/admin/updateSalary/${salary._id}`)
                        }
                      >
                        Update
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleOpenDetail(salary._id)}
                      >
                        Details
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(salary._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={totalPages * rowsPerPage}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={(event, newPage) => setCurrentPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setCurrentPage(0);
            }}
          />
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Chi tiết bậc lương</DialogTitle>
        <DialogContent>
          {selectedSalary ? (
            <div>
              <Typography>
                <strong>Mức lương:</strong> {selectedSalary.level_name}
              </Typography>
              <Typography>
                <strong>Hệ số lương:</strong>{" "}
                {selectedSalary.salary_coefficient}
              </Typography>
              <Typography>
                <strong>Lương tháng:</strong> {selectedSalary.monthly_salary}
              </Typography>
              <Typography>
                <strong>Lương ngày:</strong> {selectedSalary.daily_salary}
              </Typography>
            </div>
          ) : (
            <Typography>Đang tải...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminSalary;
