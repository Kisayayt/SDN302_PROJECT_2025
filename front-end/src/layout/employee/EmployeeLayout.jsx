import React, { useEffect } from "react";
import EmployeeHeader from "../../components/employee/EmployeeHeader";
import { Outlet, useNavigate } from "react-router-dom";
import EmployeeFooter from "../../components/employee/EmployeeFooter";

function EmployeeLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div>
      <EmployeeHeader />
      <Outlet></Outlet>
      <EmployeeFooter />
    </div>
  );
}

export default EmployeeLayout;
