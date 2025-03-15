import { BrowserRouter, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import EmployeeLayout from "./layout/employee/EmployeeLayout";
import AdminLayout from "./layout/admin/AdminLayout";
import Dashboard from "./modules/employee.modules/Dashboard";
import Login from "./modules/employee.modules/login/Login";
import AdminDashboard from "./modules/admin.modules/dashboard.admin/AdminDashboard";
import theme from "./helper/theme";

import "./index.css";
import { ThemeProvider } from "@mui/material";
import AdminDepartmentManaging from "./modules/admin.modules/department.managing/AdminDepartmentManaging";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<EmployeeLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/departments"
              element={<AdminDepartmentManaging />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
