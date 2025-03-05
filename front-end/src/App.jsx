import { BrowserRouter, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import EmployeeLayout from "./layout/employee/EmployeeLayout";
import AdminLayout from "./layout/admin/AdminLayout";
import Dashboard from "./modules/employee.modules/Dashboard";
import Login from "./modules/employee.modules/login/Login";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function App() {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:9999/auth/checkAuth", { withCredentials: true })
      .then((res) => {
        setAuth(true);
        setRole(res.data.role);
      })
      .catch(() => {
        setAuth(false);
      });
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/" element={<EmployeeLayout />}>
          <Route path="/dashboard" element={auth ? <Dashboard /> : <Login />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            path="/admin-dashboard"
            element={auth ? <Dashboard /> : <Login />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
