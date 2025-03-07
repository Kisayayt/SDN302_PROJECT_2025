import { BrowserRouter, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import EmployeeLayout from "./layout/employee/EmployeeLayout";
import AdminLayout from "./layout/admin/AdminLayout";
import Dashboard from "./modules/employee.modules/Dashboard";
import Login from "./modules/employee.modules/login/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<EmployeeLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        {/* <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<Dashboard />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
