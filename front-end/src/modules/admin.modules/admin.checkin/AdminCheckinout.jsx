import {
  Box,
  Button,
  Container,
  Grid,
  Grid2,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Sidebar from "../../../components/employee/SideBar";

dayjs.extend(utc);
dayjs.extend(timezone);

function AdminCheckinout() {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9999/attendance/getAttendance",
        {
          params: {
            page: currentPage + 1, // API dùng chỉ mục trang từ 1
            limit: rowsPerPage,
          },
        }
      );
      setAttendanceRecords(response.data.attendanceAll);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [currentPage, rowsPerPage]);

  return (
    <Container>
      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 5, mb: 3 }}>
        Quản lý Chấm Công
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} md={3}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} md={9}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Nhân viên</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Thời gian</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Loại</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Trạng thái</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell>
                      {entry.user_id?.name || "Không xác định"}
                    </TableCell>
                    <TableCell>
                      {dayjs(entry.time)
                        .tz("Asia/Ho_Chi_Minh")
                        .format("HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      {entry.type === "in" ? "Check-in" : "Check-out"}
                    </TableCell>
                    <TableCell>{entry.status}</TableCell>
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
    </Container>
  );
}

export default AdminCheckinout;
