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
import AdminCreateUser from "./modules/admin.modules/admin.create/AdminCreateUser";
import AdminUpdateUser from "./modules/admin.modules/admin.create/AdminUpdateUser";
import AdminDetailUser from "./modules/admin.modules/admin.create/AdminDetailUser";
import AdminDepartmentCreate from "./modules/admin.modules/department.managing/AdminDepartmentCreate";
import AdminDepartmentDetail from "./modules/admin.modules/department.managing/AdminDepartmentDetail";
import AdminDepartmentUpdate from "./modules/admin.modules/department.managing/AdminDepartmentUpdate";
import AdminCheckinout from "./modules/admin.modules/admin.checkin/AdminCheckinout";
import AdminSalary from "./modules/admin.modules/admin.salaryLevel/AdminSalary";
import AdminSalaryCreate from "./modules/admin.modules/admin.salaryLevel/AdminSalaryCreate";
import AdminSalaryUpdate from "./modules/admin.modules/admin.salaryLevel/AdminSalaryUpdate";

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
            <Route path="/admin/users/create" element={<AdminCreateUser />} />
            <Route
              path="/admin/users/update/:id"
              element={<AdminUpdateUser />}
            />
            <Route
              path="/admin/users/detail/:id"
              element={<AdminDetailUser />}
            />
            <Route
              path="/admin/departments"
              element={<AdminDepartmentManaging />}
            />
            <Route
              path="/admin/departments/create"
              element={<AdminDepartmentCreate />}
            />
            <Route
              path="/admin/departments/detail/:id"
              element={<AdminDepartmentDetail />}
            />
            <Route
              path="/admin/departments/update/:id"
              element={<AdminDepartmentUpdate />}
            />

            <Route path="/admin/checkinout" element={<AdminCheckinout />} />
            <Route path="/admin/salaryLevels" element={<AdminSalary />} />
            <Route path="/admin/createSalary" element={<AdminSalaryCreate />} />
            <Route
              path="/admin/updateSalary/:id"
              element={<AdminSalaryUpdate />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
