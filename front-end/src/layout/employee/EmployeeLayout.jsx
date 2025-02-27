import React from "react";
import EmployeeHeader from "../../components/employee/EmployeeHeader";
import { Outlet } from "react-router-dom";
import EmployeeFooter from "../../components/employee/EmployeeFooter";

function EmployeeLayout() {
  return (
    <div>
      <EmployeeHeader />
      <Outlet></Outlet>
      <EmployeeFooter />
    </div>
  );
}

export default EmployeeLayout;
